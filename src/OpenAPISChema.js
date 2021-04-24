class OpenAPISChema {
    constructor(model) {
        this._model = model;
        this._modelName = model.modelName;
    }

    generateSchema(method) {
		const openAPIModelName = this._modelName.toLowerCase();

		const tags = [openAPIModelName];

		const security = [
			{
				"apiKey": []
			}
		];
		if (method === "get") return this.generateGetSchema(openAPIModelName, tags, security);
		if (method === "post") return this.generatePostSchema(openAPIModelName, tags, security);
		if (method === "get-one") return this.generateGetOneSchema(openAPIModelName, tags, security);
		if (method === "put") return this.generatePutSchema(openAPIModelName, tags, security);
		if (method === "delete") return this.generateDeleteSchema(openAPIModelName, tags, security);
	}

	getProperties() {
		let model = this._model;

		const getResponseProperties = {};
		const postBodyProperties = {};

		const paths = model.schema.paths

		for (const key in paths) {
			if (Object.hasOwnProperty.call(paths, key)) {
				const element = paths[key];

				let type = element.instance;
				let elpath = element.path;

				if (type === 'ObjectID' || type === 'Date' || type === 'String') type = 'string'
				if (type === 'Number') type = 'number'

				getResponseProperties[elpath] = { type };
				if (elpath !== "_id" && elpath !== "__v") postBodyProperties[elpath] = { type };
			}
		}

		return { getResponseProperties, postBodyProperties }
	}

	generateGetSchema(modelName, tags, security) {
		const { getResponseProperties } = this.getProperties();
		return {
			schema: {
				description: `get ${modelName}}`,
				tags,
				summary: '',
				response: {
					201: {
						description: 'Successful response',
						type: 'object',
						properties: {
							total: { type: 'number' },
							items: {
								type: 'array',
								items: {
									type: 'object',
									properties: getResponseProperties
								}
							},
							displayValue: { type: 'string' }
						}
					}
				},
				security
			}
		}
	}

	generatePostSchema(modelName, tags, security) {
		const { getResponseProperties, postBodyProperties } = this.getProperties();
		return {
			schema: {
				description: `get ${modelName}}`,
				tags,
				summary: '',
				body: {
					type: 'object',
					properties: postBodyProperties
				},
				response: {
					201: {
						description: 'Successful response',
						type: 'object',
						properties: getResponseProperties
					}
				},
				security
			}
		}
	}

	generateGetOneSchema(modelName, tags, security) {
		const { getResponseProperties } = this.getProperties();
		return {
			schema: {
				description: `get ${modelName}}`,
				tags,
				summary: '',
				params: {
					type: 'object',
					properties: {
						id: {
							type: 'string',
							description: `${modelName}`
						}
					}
				},
				response: {
					201: {
						description: 'Successful response',
						type: 'object',
						properties: getResponseProperties
					}
				},
				security
			}
		}
	}

	generatePutSchema(modelName, tags, security) {
		const { getResponseProperties, postBodyProperties } = this.getProperties();
		return {
			schema: {
				description: `get ${modelName}}`,
				tags,
				summary: '',
				params: {
					type: 'object',
					properties: {
						id: {
							type: 'string',
							description: `${modelName}`
						}
					}
				},
				body: {
					type: 'object',
					properties: postBodyProperties
				},
				response: {
					201: {
						description: 'Successful response',
						type: 'object',
						properties: getResponseProperties
					}
				},
				security
			}
		}
	}

	generateDeleteSchema(modelName, tags, security) {
		return {
			schema: {
				description: `delete ${modelName}}`,
				tags,
				summary: '',
				params: {
					type: 'object',
					properties: {
						id: {
							type: 'string',
							description: `${modelName}`
						}
					}
				},
				response: {
					201: {
						description: 'Successful response',
						type: 'object',
						properties: {
							success: { type: 'boolean' }
						}
					}
				},
				security
			}
		}
	}
}

module.exports = OpenAPISChema;