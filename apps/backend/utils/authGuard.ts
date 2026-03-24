import { GraphQLError } from "graphql/error/GraphQLError";

export function requireAuth(context: any) {
    if(!context.user) {
        throw new GraphQLError("Unauthorized", {
           extensions: {code: "UNAUTHENTICATED"}  
        })
    }
}

export function requireRole(context: any, role: string) {
    requireAuth(context);

    if(!context.user.roles.includes(role)) {
        throw new GraphQLError("Forbidden", {
            extensions: {code: "FORBIDDEN"}
        })
    }
} 