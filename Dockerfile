{
	"info": {
		"_postman_id": "96e2d1fc-a348-4fca-9ab0-530a37bca114",
		"name": "VacQ",
		"description": "Backend API for reserving Vaccine jab timeslots, including hospitals, users, and bookings.",
		"schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
		"_exporter_id": "41680703"
	},
	"item": [
		{
			"name": "Hospitals",
			"item": [
				{
					"name": "Get All hospitals",
					"event": [
						{
							"listen": "test",
							"script": {
								"exec": [
									"pm.test(\"Status code is 200\", function () {",
									"    pm.response.to.have.status(200);",
									"});",
									"",
									"const response = pm.response.json();",
									"",
									"console.log(response);",
									"",
									"pm.test(\"there are some hospitals!!\", () => {",
									"    pm.expect(response.count).to.be.above(0);",
									"});",
									"",
									"pm.execution.setNextRequest(\"Create New Hospital\");"
								],
								"type": "text/javascript",
								"packages": {}
							}
						}
					],
					"request": {
						"method": "GET",
						"header": [],
						"url": {
							"raw": "{{URL}}/api/v1/hospitals",
							"host": [
								"{{URL}}"
							],
							"path": [
								"api",
								"v1",
								"hospitals"
							]
						},
						"description": "Fetch all hospitals from database."
					},
					"response": []
				},
				{
					"name": "Create New Hospital",
					"event": [
						{
							"listen": "test",
							"script": {
								"exec": [
									"pm.test(\"Status code is 201\", function () {\r",
									"    pm.response.to.have.status(201);\r",
									"});\r",
									"\r",
									"const response = pm.response.json();\r",
									"const new_hospital_id = response.data.id;\r",
									"\r",
									"pm.globals.set(\"global_hospital_id\", new_hospital_id);\r",
									"\r",
									"pm.execution.setNextRequest(\"Get Single Hospital\");"
								],
								"type": "text/javascript",
								"packages": {}
							}
						}
					],
					"request": {
						"auth": {
							"type": "bearer",
							"bearer": [
								{
									"key": "token",
									"value": "{{TOKEN}}",
									"type": "string"
								}
							]
						},
						"method": "POST",
						"header": [
							{
								"key": "Content-Type",
								"value": "application/json",
								"description": "JSON Type",
								"type": "text"
							}
						],
						"body": {
							"mode": "raw",
							"raw": "{\r\n    \"name\":\"{{$randomFullName}}\",\r\n    \"address\":\"Changwattana Pakkret\",\r\n    \"district\":\"Pakkret\",\r\n    \"province\":\"Non\",\r\n    \"postalcode\":\"10110\",\r\n    \"tel\":\"02-8369999\",\r\n    \"region\":\"à¸à¸£à¸¸à¸‡à¹€à¸—à¸žà¸¡à¸«à¸²à¸™à¸„à¸£ (Bangkok)\"\r\n}"
						},
						"url": {
							"raw": "{{URL}}/api/v1/hospitals/",
							"host": [
								"{{URL}}"
							],
							"path": [
								"api",
								"v1",
								"hospitals",
								""
							]
						}
					},
					"response": []
				},
				{
					"name": "Get Single Hospital",
					"event": [
						{
							"listen": "test",
							"script": {
								"exec": [
									"pm.test(\"Status code is 200\", function () {",
									"    pm.response.to.have.status(200);",
									"});",
									"",
									"pm.execution.setNextRequest(\"Update Single Hospital\");"
								],
								"type": "text/javascript",
								"packages": {}
							}
						}
					],
					"request": {
						"method": "GET",
						"header": [],
						"url": {
							"raw": "{{URL}}/api/v1/hospitals/:hospital_ID",
							"host": [
								"{{URL}}"
							],
							"path": [
								"api",
								"v1",
								"hospitals",
								":hospital_ID"
							],
							"variable": [
								{
									"key": "hospital_ID",
									"value": "{{global_hospital_id}}"
								}
							]
						}
					},
					"response": []
				},
				{
					"name": "Update Single Hospital",
					"event": [
						{
							"listen": "test",
							"script": {
								"exec": [
									"pm.test(\"Status code is 200\", function () {",
									"    pm.response.to.have.status(200);",
									"});",
									"",
									"pm.execution.setNextRequest(\"Delete Single Hospital\");"
								],
								"type": "text/javascript",
								"packages": {}
							}
						}
					],
					"request": {
						"auth": {
							"type": "bearer",
							"bearer": [
								{
									"key": "token",
									"value": "{{TOKEN}}",
									"type": "string"
								}
							]
						},
						"method": "PUT",
						"header": [],
						"body": {
							"mode": "raw",
							"raw": "{\n    \"name\" : \"BNH2\",\n    \"address\" : \"Changwattana Pakkret\",\n    \"district\" :\"Pakkret\",\n    \"province\" :\"Nonthaburi\",\n    \"postalcode\":\"10110\",\n    \"tel\":\"02-8369999\",\n    \"region\" : \"กรุงเทพมหานคร (Bangkok)\"\n}",
							"options": {
								"raw": {
									"language": "json"
								}
							}
						},
						"url": {
							"raw": "{{URL}}/api/v1/hospitals/:hospital_ID",
							"host": [
								"{{URL}}"
							],
							"path": [
								"api",
								"v1",
								"hospitals",
								":hospital_ID"
							],
							"variable": [
								{
									"key": "hospital_ID",
									"value": "{{global_hospital_id}}"
								}
							]
						}
					},
					"response": []
				},
				{
					"name": "Delete Single Hospital",
					"event": [
						{
							"listen": "test",
							"script": {
								"exec": [
									"pm.test(\"Status code is 200\", function () {",
									"    pm.response.to.have.status(200);",
									"});",
									"",
									"pm.execution.setNextRequest(null);"
								],
								"type": "text/javascript",
								"packages": {}
							}
						}
					],
					"request": {
						"auth": {
							"type": "bearer",
							"bearer": [
								{
									"key": "token",
									"value": "{{TOKEN}}",
									"type": "string"
								}
							]
						},
						"method": "DELETE",
						"header": [],
						"url": {
							"raw": "{{URL}}/api/v1/hospitals/:hospital_ID",
							"host": [
								"{{URL}}"
							],
							"path": [
								"api",
								"v1",
								"hospitals",
								":hospital_ID"
							],
							"variable": [
								{
									"key": "hospital_ID",
									"value": "{{global_hospital_id}}"
								}
							]
						}
					},
					"response": []
				}
			],
			"description": "Hospitals CRUD functionality"
		},
		{
			"name": "Authentication",
			"item": [
				{
					"name": "Register",
					"event": [
						{
							"listen": "test",
							"script": {
								"exec": [
									"pm.environment.set(\"TOKEN\",pm.response.json().token)"
								],
								"type": "text/javascript",
								"packages": {}
							}
						}
					],
					"request": {
						"method": "POST",
						"header": [],
						"body": {
							"mode": "raw",
							"raw": "{\n    \"name\": \"John Doe\",\n    \"email\": \"admin@gmail.com\",\n    \"password\": \"12345678\",\n    \"role\": \"admin\"\n}",
							"options": {
								"raw": {
									"language": "json"
								}
							}
						},
						"url": {
							"raw": "{{URL}}/api/v1/auth/register",
							"host": [
								"{{URL}}"
							],
							"path": [
								"api",
								"v1",
								"auth",
								"register"
							]
						}
					},
					"response": []
				},
				{
					"name": "Login",
					"event": [
						{
							"listen": "test",
							"script": {
								"exec": [
									"pm.environment.set(\"TOKEN\",pm.response.json().token)"
								],
								"type": "text/javascript",
								"packages": {}
							}
						}
					],
					"request": {
						"method": "POST",
						"header": [],
						"body": {
							"mode": "raw",
							"raw": "{    \n    \"email\": \"user8@gmail.com\",\n    \"password\": \"12345678\"\n}",
							"options": {
								"raw": {
									"language": "json"
								}
							}
						},
						"url": {
							"raw": "{{URL}}/api/v1/auth/login",
							"host": [
								"{{URL}}"
							],
							"path": [
								"api",
								"v1",
								"auth",
								"login"
							]
						}
					},
					"response": []
				},
				{
					"name": "getMe",
					"protocolProfileBehavior": {
						"disableBodyPruning": true
					},
					"request": {
						"method": "GET",
						"header": [
							{
								"key": "Authorization",
								"value": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3YjZmNTUzMWU0Njk4ZTQ5ODlkMzBiZCIsImlhdCI6MTc0MDA0MzcxNiwiZXhwIjoxNzQyNjM1NzE2fQ.7ZbTHL_5uqjvCXk7snimamVhvC8P89JJpq8vNYVPOvU",
								"type": "text"
							}
						],
						"body": {
							"mode": "raw",
							"raw": "",
							"options": {
								"raw": {
									"language": "json"
								}
							}
						},
						"url": {
							"raw": "{{URL}}/api/v1/auth/me",
							"host": [
								"{{URL}}"
							],
							"path": [
								"api",
								"v1",
								"auth",
								"me"
							]
						}
					},
					"response": []
				},
				{
					"name": "logout",
					"event": [
						{
							"listen": "test",
							"script": {
								"exec": [
									"//pm.environment.set(\"TOKEN\",null);"
								],
								"type": "text/javascript",
								"packages": {}
							}
						}
					],
					"request": {
						"auth": {
							"type": "bearer",
							"bearer": [
								{
									"key": "token",
									"value": "{{TOKEN}}",
									"type": "string"
								}
							]
						},
						"method": "GET",
						"header": [],
						"url": {
							"raw": "{{URL}}/api/v1/auth/logout",
							"host": [
								"{{URL}}"
							],
							"path": [
								"api",
								"v1",
								"auth",
								"logout"
							]
						}
					},
					"response": []
				}
			]
		}
	],
	"event": [
		{
			"listen": "prerequest",
			"script": {
				"type": "text/javascript",
				"packages": {},
				"exec": [
					""
				]
			}
		},
		{
			"listen": "test",
			"script": {
				"type": "text/javascript",
				"packages": {},
				"exec": [
					""
				]
			}
		}
	],
	"variable": [
		{
			"key": "URL",
			"value": "http://mywebapp-env.eba-gkeqbu2b.us-east-1.elasticbeanstalk.com",
			"type": "string"
		},
		{
			"key": "TOKEN",
			"value": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZWU4YTcwZTJiNzNjYjZmZjhhNzliZCIsImlhdCI6MTc0NDg4MzkyNywiZXhwIjoxNzQ3NDc1OTI3fQ.fZ8OumgppFb_mbBEP2kJlIsPpDs33TAKmqeVxDwXCQc",
			"type": "string"
		}
	]
}