import {
  ApolloClient,
  InMemoryCache,
  Observable,
  ApolloLink,
  HttpLink,
  CombinedGraphQLErrors,
} from "@apollo/client";
import { gql } from "@apollo/client";
import { ErrorLink } from "@apollo/client/link/error";

type RefreshAccessTokenResponse = {
  refreshAccessToken: {
    success: boolean;
    message: string;
  };
};

const REFRESH_TOKEN_MUTATION = gql`
  mutation RefreshAccessToken {
    refreshAccessToken {
      success
      message
    }
  }
`;

const httpLink = new HttpLink({
  uri: () =>
    typeof window !== "undefined"
      ? `http://${window.location.hostname}:4000/graphql`
      : process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/graphql",
  credentials: "include",
});

let isRefreshing = false;
let pendingRequests: (() => void)[] = [];

const resolvePendingRequests = () => {
  pendingRequests.map((cb) => cb());
  pendingRequests = [];
};

const redirectToSignup = () => {
  if (typeof window === "undefined") return;
  const AUTH_PAGES = ["/signup", "/login"];
  const currentPath = window.location.pathname;
  if (AUTH_PAGES.includes(currentPath)) return; // already on auth page, don't loop
  window.location.href = `/signup?callbackUrl=${encodeURIComponent(
    currentPath + window.location.search
  )}`;
};

export const refreshToken = async () => {
  const { data } = await client.mutate<RefreshAccessTokenResponse>({
    mutation: REFRESH_TOKEN_MUTATION,
    context: { skipAuth: true },
  });
  if (!data?.refreshAccessToken?.success) {
    throw new Error("Refresh failed");
  }
  return data;
};

const authErrorLink = new ErrorLink(({ error, operation, forward }) => {
  const { skipAuth } = operation.getContext();

  if (!CombinedGraphQLErrors.is(error)) return forward(operation);

  const isUnauthenticated = error.errors.some(
    (e) => e.extensions?.code === "UNAUTHENTICATED"
  );

  if (!isUnauthenticated || skipAuth) return forward(operation);

  return new Observable((observer) => {
    let subscription: any;

    if (isRefreshing) {
      // Queue this operation until refresh completes
      pendingRequests.push(() => {
        subscription = forward(operation).subscribe(observer);
      });
      return () => subscription?.unsubscribe();
    }

    isRefreshing = true;

    refreshToken()
      .then(() => {
        isRefreshing = false;
        resolvePendingRequests();
        subscription = forward(operation).subscribe(observer); // retry original
      })
      .catch((err) => {
        isRefreshing = false;
        pendingRequests = [];
        redirectToSignup(); // refresh token also expired → force login
        observer.error(err);
      });

    return () => subscription?.unsubscribe();
  });
});

const link = ApolloLink.from([authErrorLink, httpLink]);

export const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
  defaultOptions: {
    query: { errorPolicy: "none" },
    mutate: { errorPolicy: "none" },
  },
});