const DBS = {}

const defaultDBConfig = {
	name:"keepwork",
	version: 1,
	isOpen: false,
	storeList:[
		{
			storeName:"sitepage",
			storeKey:"path",
		},
	],
}

// 打开数据库
export const DBFactory = function (config) {
	config = config || defaultDBConfig;
	config.name = config.name || "keepwork";
	config.version = config.version || 1;

	const DB = DBS[config.name] || {};
	DBS[config.name] = DB;
	DB.config = config;
	
	DB.open = function() {
		const self = this;
		return new Promise(function(resolve, reject) {
			if (self.isOpen) {
				resolve(true);
				return;
			}

			var db = window.indexedDB.open(self.config.name, self.config.version);

			db.onerror = function (e) {
				console.log(e);
				reject(false);
			}
			
			db.onsuccess = function (e) {
				console.log('index db open success');
				self.indexDB = e.target.result;
				self.isOpen = true;
				resolve(true);
			}

			db.onupgradeneeded = function (e) {
				self.indexDB = e.target.result;
				console.log('index db onupgradeneeded');

				for (var i = 0; i < self.config.storeList.length; i++) {
					var store = self.config.storeList[i];
					if (!self.indexDB.objectStoreNames.contains(store.storeName)) {
						self.indexDB.createObjectStore(store.storeName,{keyPath:store.storeKey});
					}
				}
				self.isOpen = true;
				resolve(true);
			}
		});
	}

	DB.close = function() {
		this.indexDB.close();
	}

	DB.delete = function() {
		window.indexedDB.deleteDatabase(this.config.name);
	}
	
	// 获取store 全部记录
	DB.getAllItem = function (storeName) {
		const self = this;
		return new Promise(function(resolve, reject){
			const transaction=self.indexDB.transaction([storeName], 'readwrite');
			const store=transaction.objectStore(storeName);
			const request = store.openCursor();
			const list = [];
			request.onsuccess = function(e) {
				const cursor = e.target.result
				if (cursor) {
					list.push(cursor.value);
					cursor.continue();
				} else {
					resolve(list);
				}
			}
			request.onerror = function (e) {
				reject();
			}
		});
	}

	DB.getItem = function (storeName, key) {
		const self = this;
		return new Promise(function(resolve, reject){
			var transaction=self.indexDB.transaction([storeName], 'readwrite');
			var store=transaction.objectStore(storeName);
			var request=store.get(key);
			request.onsuccess=function(e){
				resolve(e.target.result);
			};
			request.onerror = function () {
				reject();
			}
		});
	}

	DB.setItem = function (storeName, value) {
		const self = this;
		return new Promise(function(resolve, reject){
			var transaction=self.indexDB.transaction([storeName], 'readwrite');
			var store=transaction.objectStore(storeName);
			var request=store.put(value);
			request.onsuccess=function(e){
				resolve(e.target.result);
			};
			request.onerror = function () {
				reject();
			}
		});
	}

	DB.deleteItem = function (storeName, key) {
		const self = this;
		return new Promise(function(resolve, reject){
			var transaction=self.indexDB.transaction([storeName], 'readwrite');
			var store=transaction.objectStore(storeName);
			var request=store.delete(key);
			request.onsuccess=function(e){
				resolve(e.target.result);
			};
			request.onerror = function () {
				reject();
			}
		});
	}

	DB.clearAllItem = function (storeName) {
		const self = this;
		return new Promise(function(resolve, reject){
			var transaction=self.indexDB.transaction([storeName], 'readwrite');
			var store=transaction.objectStore(storeName);
			var request=store.clear();
			request.onsuccess=function(e){
				resolve(e.target.result);
			};
			request.onerror = function () {
				reject();
			}
		});
	}

	DB.getStore = function(storeName) {
		const self = this;
		return {
			storeName:storeName,
			get: function(success, error, finish) {
				return self.getAllItem(storeName);
			},
			getItem: function(key, success, error) {
				return self.getItem(storeName, key);
			},
			setItem: function(value, success, error) {
				return self.setItem(storeName, value);
			},
			deleteItem: function(key, success, error) {
				return self.deleteItem(storeName, key);
			},
			clear: function(success, error) {
				return self.clearAllItem(storeName);
			},
		};
	}

	return DB;
}


export default DBFactory();
