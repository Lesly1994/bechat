module.exports = app => {

	/**
	 * Display the "index" when the route is /
	 * @param {Object} $request
	 * @param {Object} $response
	 */
	app.get("/", ($request, $response) => {
		return $response.render('index');
	});
};
