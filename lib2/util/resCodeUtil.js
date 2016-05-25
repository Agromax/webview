var _Res = {	

	invalidToken: function(token) {
		return {
			code: -1,
			msg: 'Invalid authentication token. Please obtain another token'
		}
	}

};

module.exports = _Res;