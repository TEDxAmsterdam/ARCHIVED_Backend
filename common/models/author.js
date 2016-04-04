/**
 * @author <dligthart>
 */
module.exports = function(Author) {

	//Author.disableRemoteMethod("create", true);
	//Author.disableRemoteMethod("upsert", true);
	Author.disableRemoteMethod("updateAll", true);
	//Author.disableRemoteMethod("updateAttributes", false);
	Author.disableRemoteMethod('createChangeStream', true);
	//Author.disableRemoteMethod("find", true);
	//Author.disableRemoteMethod("findById", true);
	//Author.disableRemoteMethod("findOne", true);

	//Author.disableRemoteMethod("deleteById", true);

	//Author.disableRemoteMethod("confirm", true);
	//Author.disableRemoteMethod("count", true);
	//Author.disableRemoteMethod("exists", true);
	//Author.disableRemoteMethod("resetPassword", true);

	Author.disableRemoteMethod('__count__accessTokens', false);
	Author.disableRemoteMethod('__create__accessTokens', false);
	Author.disableRemoteMethod('__delete__accessTokens', false);
	Author.disableRemoteMethod('__destroyById__accessTokens', false);
	Author.disableRemoteMethod('__findById__accessTokens', false);
	Author.disableRemoteMethod('__get__accessTokens', false);
	Author.disableRemoteMethod('__updateById__accessTokens', false);

	//Author.disableRemoteMethod('__count__posts', false);
	//Author.disableRemoteMethod('__create__posts', false);
//	Author.disableRemoteMethod('__delete__posts', false);
	//Author.disableRemoteMethod('__destroyById__posts', false);
	//Author.disableRemoteMethod('__findById__posts', false);
	//Author.disableRemoteMethod('__get__posts', false);
	//Author.disableRemoteMethod('__updateById__posts', false);
};
