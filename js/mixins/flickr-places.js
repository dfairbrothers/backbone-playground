// Flickr place_ids
(function ( mixins ) {
	
var api = {
	key : 'd238b34ddf382dfcee11bf0ced5e9f18',
};

var lookups = {
	zoom : ['country', 'region', 'locality', 'neighbourhood'],
	place_type_id : {
		neighbourhood: 22,
		'22': 'neighbourhood',
		locality: 7,
		'7': 'locality',
		region: 8,
		'8': 'region',
		country: 12,
		'12': 'country',
		continent: 29,
		'29': "continent",
	},
}


// find: places.find() query=paris
// http://api.flickr.com/services/rest/?method=flickr.places.find&api_key=2b03e0fdf5c56007904af4f83e00537f&query=paris&format=json

// findByUrl, A flickr.com/places URL in the form of /country/region/city
// http://api.flickr.com/services/rest/?method=flickr.places.getInfoByUrl&api_key=2b03e0fdf5c56007904af4f83e00537f&url=%2FFrance%2FParis&format=json

// zoom IN: places.getChildrenWithPhotosPublic(), lbWye9tTUb6GOcp80w, country=france
// http://api.flickr.com/services/rest/?method=flickr.places.getChildrenWithPhotosPublic&api_key=2b03e0fdf5c56007904af4f83e00537f&place_id=lbWye9tTUb6GOcp80w&format=json

// zoom OUT, places.getInfo() EsIQUYZXU79_kEA, locality=paris
// http://api.flickr.com/services/rest/?method=flickr.places.getInfo&api_key=2b03e0fdf5c56007904af4f83e00537f&place_id=EsIQUYZXU79_kEA&format=json

// photos
// http://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=2b03e0fdf5c56007904af4f83e00537f&tags=landmarks&place_id=EsIQUYZXU79_kEA&per_page=20&format=rest


var FlickrApi = {
	config: {
		baseurl: 'http://api.flickr.com/services/rest/',
		qs: {
			api_key: api.key,
			format: 'json',
		},
	},
	querystring : {
		find: {
			method:'flickr.places.find',
			query: '',
		},
		findByUrl: {
			method:'flickr.places.getInfoByUrl',
			url: '',
		},
		zoomIn: {
			method:'flickr.places.getChildrenWithPhotosPublic',
			place_id: '',
		},
		zoomOut: {
			method: 'flickr.places.getInfo',
			place_id: '',
		},
		photos: {
			method: 'flickr.photos.search',
			tags: '',
			place_id: '',
			min_taken_date: '',
			max_taken_date: '',
			sort: 'date-taken-desc', // 'interestingness-desc'
			license: '2,4,5',
			content_type: '1',
			media: 'photos',
			extras: 'date_taken,url_m,views,geo',
			per_page: 50,
		}
	},
	getApiRequest: function(method, options){
		options = options || {};
		var qs = _.defaults(options, FlickrApi.querystring[method],  FlickrApi.config.qs);
		_.each(qs, function(v,k,l){
			if ( !v ) delete qs[k];
		});
		// var url = FlickrApi.config.baseurl + '?' + $.param(qs);
		return {
			url: FlickrApi.config.baseurl,
			data: qs 
		};
	},
	get: function(method, options, success){
		var req = FlickrApi.getApiRequest(method, options);
		var xhrOptions = {
			dataType: 'jsonp',
			jsonpCallback: 'jsonFlickrApi',
			cache: true,
		}
		xhrOptions = _.defaults(req, xhrOptions);
		$.ajax(xhrOptions).done(function(json){
			if (json.stat != 'ok'){
				console.error("Error: flickr api returned with stat=failed");
				console.error(req);
				return;
			}
			if (_.isFunction(FlickrApiParse[method])) {
				var parsed_json = FlickrApiParse[method](json);	
				if (_.isFunction(success)) success(parsed_json);
			} else 
				if (_.isFunction(success)) success(json);
		});
	},
}

var FlickrApiParse = {
	findByUrl : function(json) {
		var parsed = {};
		if (json.stat != 'ok') { 
			console.error("Error: json response error for flickr.places.getInfoByUrl");
			return json;
		}
		var place = json.place;
		var row = {
			longitude: parseFloat(place.longitude),
			name: place.name,
			place_id: place.place_id,
			place_type: place.place_type,
			place_type_id: place.place_type_id,
			locality_place_id: place.place_id,
		}
		parsed[row.place_type] = row;
		// placedb[ row['place_type'] ].places.push(row);

		_.each(lookups.zoom, function(place_type, i, l) {
			var zoomOut = place[place_type];
			if (zoomOut) {
				var parent_row = {
					longitude: parseFloat(zoomOut.longitude),
					name: zoomOut._content,
					place_id: zoomOut.place_id,
					place_type: place_type,
					place_type_id: lookups.place_type_id[place_type],
					locality_place_id: row.place_id,
				}
				parsed[parent_row.place_type] = parent_row;
				// placedb[ parent_row['place_type'] ].places.push(parent_row);
			}
		})

		return parsed;
	},
	photo :  function(json){
		var parsed = {};
		if (json.stat != 'ok') 
			console.error("Error: json response error for flickr.photos.search");
		_.each(json.photos.photo, function(e,i,l){
			var row = {
				id: e.id,
				owner: e.owner,
				dateTaken : e.datetaken,
				W: parseInt(e.width_m),
				H: parseInt(e.height_m),
				place_id: e.place_id,
				longitude: parseFloat(e.longitude),
				views: parseInt(e.views),
				title: e.title,
				url: e.url_m.replace('.jpg', '_m.jpg'),
				flickr_url: 'http://www.flickr.com/photos/' + e.owner + '/' + e.id, 
			}
			json.photos.photo[i].parsed = row;

		});
	},	
}


var placeUrls = [
	'/united states/california/san francisco',
	'/united states/california/los angeles',
	'/united states/washington/seattle',
	'/united states/missouri/st louis',
	'/united states/new york/new york',
	'/united states/district of columbia/washington',
	'/brazil/rio de janeiro/rio de janeiro',
	'/United Kingdom/England/London',
	'/France/Ile-de-France/Paris',
	'/Italy/Lazio/Roma',
	'/Italy/Tuscany/Firenze',
	'/Greece/Attiki/Athens',
	'/Turkey/Istanbul/İstanbul',
	'/Tanzania/Mara',
	'/Egypt/Al Jizah/Giza',
	'/Russia/Moskva/Moscow',
	'/Republik Indonesia/Bali',
	'/China/Beijing/北京',
	'/Australia/New South Wales/Sydney',
];


var place_db = {
	cached: '{"country":{"zoom_level":0,"place_type_id":12,"places":[{"longitude":-95.845,"name":"United States","place_id":"nz.gsghTUb4c2WAecA","place_type":"country","place_type_id":12,"locality_place_id":"7.MJR8tTVrIO1EgB"},{"longitude":-95.845,"name":"United States","place_id":"nz.gsghTUb4c2WAecA","place_type":"country","place_type_id":12,"locality_place_id":"7Z5HMmpTVr4VzDpD"},{"longitude":-95.845,"name":"United States","place_id":"nz.gsghTUb4c2WAecA","place_type":"country","place_type_id":12,"locality_place_id":"uiZgkRVTVrMaF2cP"},{"longitude":-95.845,"name":"United States","place_id":"nz.gsghTUb4c2WAecA","place_type":"country","place_type_id":12,"locality_place_id":"lMxJy4dTVrIP_zem"},{"longitude":-95.845,"name":"United States","place_id":"nz.gsghTUb4c2WAecA","place_type":"country","place_type_id":12,"locality_place_id":".skCPTpTVr.Q3WKW"},{"longitude":-95.845,"name":"United States","place_id":"nz.gsghTUb4c2WAecA","place_type":"country","place_type_id":12,"locality_place_id":"aKGrC25TV7vTJcir"},{"longitude":-54.387,"name":"Brazil","place_id":"xQfoS31TUb6eduaTWQ","place_type":"country","place_type_id":12,"locality_place_id":"mAqmHW5VV78OT5o"},{"longitude":-2.23,"name":"United Kingdom","place_id":"cnffEpdTUb5v258BBA","place_type":"country","place_type_id":12,"locality_place_id":"hP_s5s9VVr5Qcg"},{"longitude":1.718,"name":"France","place_id":"lbWye9tTUb6GOcp80w","place_type":"country","place_type_id":12,"locality_place_id":"EsIQUYZXU79_kEA"},{"longitude":12.573,"name":"Italy","place_id":"5QqgvRVTUb7tSzaDpQ","place_type":"country","place_type_id":12,"locality_place_id":"uijRnjBWULsQTwc"},{"longitude":12.573,"name":"Italy","place_id":"5QqgvRVTUb7tSzaDpQ","place_type":"country","place_type_id":12,"locality_place_id":"ZPDshblWU7_DgSs"},{"longitude":21.845,"name":"Greece","place_id":"s1JMkOJTUb5LfB9USg","place_type":"country","place_type_id":12,"locality_place_id":"iyi6cGxYVrxd.XE"},{"longitude":30.246,"name":"Egypt","place_id":"QXJrdeNTUb6MYrcvXQ","place_type":"country","place_type_id":12,"locality_place_id":"ZxhLUyJQV7hkYwbK"},{"longitude":34.885,"name":"Tanzania","place_id":"YhQ3yHpTUb4clWyAtQ","place_type":"country","place_type_id":12,"locality_place_id":"0r2bQrZTUb7SUIZ0"},{"longitude":35.431,"name":"Turkey","place_id":"aaobVhlTUb58c3KqSA","place_type":"country","place_type_id":12,"locality_place_id":"l02DEdJTUb5XGlLZ"},{"longitude":104.165,"name":"China","place_id":"MH3w3ENTUb45a2.GqA","place_type":"country","place_type_id":12,"locality_place_id":"vQ6vOjpTU7_QE6S8"},{"longitude":108.831,"name":"Russia","place_id":"gMMKN7VTUb7Dg.7SoQ","place_type":"country","place_type_id":12,"locality_place_id":"Gyn7fcFTU7gkY7d5"},{"longitude":113.917,"name":"Indonesia","place_id":"QZY1SiRTUb674.n_LA","place_type":"country","place_type_id":12,"locality_place_id":"lm4_wrhTUb4oe5pO"},{"longitude":133.393,"name":"Australia","place_id":"3fHNxEZTUb4mc08chA","place_type":"country","place_type_id":12,"locality_place_id":"2AEwArxQU7pLPY08"}]},"region":{"zoom_level":1,"place_type_id":8,"places":[{"longitude":-120.832,"name":"Washington, United States","place_id":"jyADg3RTUb65Hnbj","place_type":"region","place_type_id":8,"locality_place_id":"uiZgkRVTVrMaF2cP"},{"longitude":-119.27,"name":"California, United States","place_id":"NsbUWfBTUb4mbyVu","place_type":"region","place_type_id":8,"locality_place_id":"7.MJR8tTVrIO1EgB"},{"longitude":-119.27,"name":"California, United States","place_id":"NsbUWfBTUb4mbyVu","place_type":"region","place_type_id":8,"locality_place_id":"7Z5HMmpTVr4VzDpD"},{"longitude":-92.436,"name":"Missouri, United States","place_id":"rLGx4JpTUb6lauZn","place_type":"region","place_type_id":8,"locality_place_id":"lMxJy4dTVrIP_zem"},{"longitude":-77.014,"name":"District of Columbia, United States","place_id":".9.rXhhTUb5eYUuK","place_type":"region","place_type_id":8,"locality_place_id":"aKGrC25TV7vTJcir"},{"longitude":-76.501,"name":"New York, United States","place_id":"ODHTuIhTUb75gdBu","place_type":"region","place_type_id":8,"locality_place_id":".skCPTpTVr.Q3WKW"},{"longitude":-42.921,"name":"Rio de Janeiro, Brazil","place_id":"fCgNtJ9TUb7DgEOD","place_type":"region","place_type_id":8,"locality_place_id":"mAqmHW5VV78OT5o"},{"longitude":-1.974,"name":"England, United Kingdom","place_id":"2eIY2QFTVr_DwWZNLg","place_type":"region","place_type_id":8,"locality_place_id":"hP_s5s9VVr5Qcg"},{"longitude":2.502,"name":"Ile-de-France, France","place_id":"QLdv_.RWU7_jEfrE","place_type":"region","place_type_id":8,"locality_place_id":"EsIQUYZXU79_kEA"},{"longitude":11.029,"name":"Tuscany, Italy","place_id":"yU7tk6NWU795lMYh","place_type":"region","place_type_id":8,"locality_place_id":"ZPDshblWU7_DgSs"},{"longitude":12.738,"name":"Lazio, Italy","place_id":"Txy_tk1WU79uo4MR","place_type":"region","place_type_id":8,"locality_place_id":"uijRnjBWULsQTwc"},{"longitude":23.596,"name":"Attiki, Greece","place_id":"k7Im6tpQUL9bun6_ig","place_type":"region","place_type_id":8,"locality_place_id":"iyi6cGxYVrxd.XE"},{"longitude":28.964,"name":"Istanbul, Turkey","place_id":"SlXpmNdTUb7UklFi","place_type":"region","place_type_id":8,"locality_place_id":"l02DEdJTUb5XGlLZ"},{"longitude":31.14,"name":"Al Jizah, Egypt","place_id":"VX9BKV5TUb5N7WsS","place_type":"region","place_type_id":8,"locality_place_id":"ZxhLUyJQV7hkYwbK"},{"longitude":33.981,"name":"Mara, Tanzania","place_id":"0r2bQrZTUb7SUIZ0","place_type":"region","place_type_id":8,"locality_place_id":"0r2bQrZTUb7SUIZ0"},{"longitude":37.621,"name":"Moskva, Russia","place_id":"yFvJfEtTUb5x9_pp","place_type":"region","place_type_id":8,"locality_place_id":"Gyn7fcFTU7gkY7d5"},{"longitude":115.072,"name":"Bali, Indonesia","place_id":"lm4_wrhTUb4oe5pO","place_type":"region","place_type_id":8,"locality_place_id":"lm4_wrhTUb4oe5pO"},{"longitude":116.422,"name":"Beijing, China","place_id":"efYrQKFQUL84fwdWXg","place_type":"region","place_type_id":8,"locality_place_id":"vQ6vOjpTU7_QE6S8"},{"longitude":147.319,"name":"New South Wales, Australia","place_id":"2X2nIstTUb5_0uWe","place_type":"region","place_type_id":8,"locality_place_id":"2AEwArxQU7pLPY08"}]},"locality":{"zoom_level":2,"place_type_id":7,"places":[{"longitude":-122.42,"name":"San Francisco, California, United States","place_id":"7.MJR8tTVrIO1EgB","place_type":"locality","place_type_id":7,"locality_place_id":"7.MJR8tTVrIO1EgB"},{"longitude":-122.329,"name":"Seattle, Washington, United States","place_id":"uiZgkRVTVrMaF2cP","place_type":"locality","place_type_id":7,"locality_place_id":"uiZgkRVTVrMaF2cP"},{"longitude":-118.245,"name":"Los Angeles, California, United States","place_id":"7Z5HMmpTVr4VzDpD","place_type":"locality","place_type_id":7,"locality_place_id":"7Z5HMmpTVr4VzDpD"},{"longitude":-90.199,"name":"St. Louis, Missouri, United States","place_id":"lMxJy4dTVrIP_zem","place_type":"locality","place_type_id":7,"locality_place_id":"lMxJy4dTVrIP_zem"},{"longitude":-77.028,"name":"Washington, District of Columbia, United States","place_id":"aKGrC25TV7vTJcir","place_type":"locality","place_type_id":7,"locality_place_id":"aKGrC25TV7vTJcir"},{"longitude":-74.007,"name":"New York, NY, United States","place_id":".skCPTpTVr.Q3WKW","place_type":"locality","place_type_id":7,"locality_place_id":".skCPTpTVr.Q3WKW"},{"longitude":-43.195,"name":"Rio de Janeiro, RJ, Brazil","place_id":"mAqmHW5VV78OT5o","place_type":"locality","place_type_id":7,"locality_place_id":"mAqmHW5VV78OT5o"},{"longitude":-0.127,"name":"London, England, United Kingdom","place_id":"hP_s5s9VVr5Qcg","place_type":"locality","place_type_id":7,"locality_place_id":"hP_s5s9VVr5Qcg"},{"longitude":2.341,"name":"Paris, Ile-de-France, France","place_id":"EsIQUYZXU79_kEA","place_type":"locality","place_type_id":7,"locality_place_id":"EsIQUYZXU79_kEA"},{"longitude":11.254,"name":"Florence, Tuscany, Italy","place_id":"ZPDshblWU7_DgSs","place_type":"locality","place_type_id":7,"locality_place_id":"ZPDshblWU7_DgSs"},{"longitude":12.495,"name":"Rome, Lazio, Italy","place_id":"uijRnjBWULsQTwc","place_type":"locality","place_type_id":7,"locality_place_id":"uijRnjBWULsQTwc"},{"longitude":23.736,"name":"Athens, Attiki, Greece","place_id":"iyi6cGxYVrxd.XE","place_type":"locality","place_type_id":7,"locality_place_id":"iyi6cGxYVrxd.XE"},{"longitude":28.986,"name":"Istanbul, Istanbul, Turkey","place_id":"l02DEdJTUb5XGlLZ","place_type":"locality","place_type_id":7,"locality_place_id":"l02DEdJTUb5XGlLZ"},{"longitude":31.194,"name":"Giza, Al Jizah, Egypt","place_id":"ZxhLUyJQV7hkYwbK","place_type":"locality","place_type_id":7,"locality_place_id":"ZxhLUyJQV7hkYwbK"},{"longitude":37.615,"name":"Moscow, Moskva, Russia","place_id":"Gyn7fcFTU7gkY7d5","place_type":"locality","place_type_id":7,"locality_place_id":"Gyn7fcFTU7gkY7d5"},{"longitude":116.387,"name":"Beijing, Beijing, China","place_id":"vQ6vOjpTU7_QE6S8","place_type":"locality","place_type_id":7,"locality_place_id":"vQ6vOjpTU7_QE6S8"},{"longitude":151.206,"name":"Sydney, New South Wales, Australia","place_id":"2AEwArxQU7pLPY08","place_type":"locality","place_type_id":7,"locality_place_id":"2AEwArxQU7pLPY08"}]},"neighbourhood":{"zoom_level":3,"place_type_id":22,"places":[]}}',
	country: {
		zoom_level: 0,
		place_type_id: 12,
		places: [
			// {
			// 	longitude: float,
			// 	name: string,
			// 	place_id: place_id,
			// 	place_type: [country | region | locality | neighborhood ]
			// 	place_type_id: [ 12 | 8 | 7 | 22],
			// 	locality_place_id: place_id,
			// }
		],
	},
	region:{
		zoom_level: 1,
		place_type_id: 8,
		places: [],
	},
	locality:{
		zoom_level: 2,
		place_type_id: 7,
		places: [],
	},
	neighbourhood:{
		zoom_level: 3,
		place_type_id: 22,
		places: [],
	},
};

var getPlace = function (placeUrl, success){
		var method = 'findByUrl',
			options = {url: placeUrl};
		FlickrApi.get(method, options, success);
};

var exports = {
	initialize: function(force){
		if (place_db.cached && !force) {
			place_db.cached = JSON.parse(place_db.cached);
			console.log(place_db.cached);
		}
		exports.loadPlaceDb(placeUrls, place_db, function(place_db){
			$('#json').html(place_db.cached);
		});
	},
	placeUrls: placeUrls,
	loadPlaceDb: function (placeUrls, place_db, complete){
		var done = placeUrls.length-1,
			API_DELAY = 250,
			serialized = [],
			nextFetch;
			
	 	_.each(placeUrls, function(place,i,l){
			serialized.push(function(){
				getPlace(place, function(parsed_json){
					_.each(parsed_json, function(v,k,l){
						place_db[k].places.push(v);
					});
					nextFetch = serialized.shift();
					if (nextFetch) {
						_.delay(nextFetch, API_DELAY);
					} else {
						console.info("place_db loaded");
						// sort
						_.each(place_db, function(v,k,l){
							 place_db[k].places = _.sortBy(v.places,function(p){
							 	return parseFloat(p.longitude+180);
							 });
						});
						console.info("place_db sorted by longitude");
						delete place_db.cached
						place_db.cached = JSON.stringify(place_db); 
						if (_.isFunction(complete)) complete(place_db);
					}
				});
			});
		})
		
		nextFetch = serialized.shift();
		if (nextFetch) {
			nextFetch();
		} else {
			console.info("place_db, nothing to load");
			if (_.isFunction(complete)) complete(place_db);
		}
	},
	/*
	 * get timeline
	 */
	getPlaceLine: function (zoom, options, place_db){
	 	zoom = zoom || lookups.zoom[0];
	 	options = options || {};
	 	var zoom_level = lookups.zoom.indexOf(zoom),
	 		place_id_type = lookups.place_id_type[zoom],
	 		places = place_db[zoom];
	
	 	switch (zoom_level) {
	 		case 0: // country
	 			_.each(places.places, function(place,i,l){
	 				var method = 'photos',
	 					options = {
	 						place_id: place.place_id, 
	 						// place_id: place.locality_place_id, 
	 						tags: 'landmarks',
	 						per_page: '10',
	 					},
	 					success = function(json){
	 						var photos = json.photos;
	 						_.each(photos.photo, function(e,i,l){
	 							// render photo in GalleryCollection
	 						});
	 					};
	 				FlickrApi.get(method,options,success);
	 			})
	 		break;
	 	}	
	},
}

mixins.FlickrPlaces = {
	'FlickrApi': exports,
};

})( snappi.mixins);