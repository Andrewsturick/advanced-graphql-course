const {formatDate} = require('./utils')
const {AuthenticationError, SchemaDirectiveVisitor} = require("apollo-server")
const {defaultFieldResolver, GraphQLString} = require("graphql");


class DateFormatterDirective extends SchemaDirectiveVisitor {
    visitFieldDefinition(field) {
        const {resolve = defaultFieldResolver} = field;

        const {format: formatOnTypeDef} = this.args;
        field.args.push({
            type: GraphQLString,
            name: "format"
        })
        console.log({formatOnTypeDef})
        field.resolve = async function resolver(root, {format, ...rest}, ctx, info) {
            
            const result = await resolve.call(this, root, {...rest}, ctx, info);

            return formatDate(parseInt(result), format || formatOnTypeDef);
        }
    }
}

class AuthDirective extends SchemaDirectiveVisitor {
    visitFieldDefinition(field) {
        const {resolve = defaultFieldResolver} = field;
        const {requiredRole} = this.args;

        console.log("in the sauth directive")
        field.resolve = async function (root, args, ctx, info){
            console.log("in the auth resolver")
            console.log({requiredRole, role: ctx.user.role})
            if (ctx.user && ctx.user.role === requiredRole) {
                const response = await resolve.call(this, root, args, ctx, info);
                return response;
            }
            throw new AuthenticationError();
        };
    }
}


module.exports = {AuthDirective};