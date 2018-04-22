//import Request from 'request-promise';
import axios from "axios";
import Humps from 'humps';
import LinkParser from 'parse-link-header';
import URLJoin from 'url-join';

function defaultRequest(
  url,
  endpoint,
  { method, headers, body, qs, formData},
) {
  const params = {
    url: URLJoin(url, endpoint),
	method,
    headers,
  };

  if (body) params.data = Humps.decamelizeKeys(body);
  if (qs) params.params = Humps.decamelizeKeys(qs);
  if (formData) params.data = formData;


  return params;
}

class RequestHelper {
  static async get(service, endpoint, options = {}) {
    const response = await axios(defaultRequest(service.url, endpoint, {
	  method: "get",
      headers: service.headers,
      qs: options,
      resolveWithFullResponse: true,
    }));

    const links = LinkParser(response.headers.link);
    const page = response.headers['x-page'];
    const limit = options.maxPages ? page < options.maxPages : true;
    let more = [];

    if (page && limit && links.next) {
      more = await RequestHelper.get(service, links.next.url.replace(service.url, ''), options);

      return [...response.data, ...more];
    }

    return response.data;
  }

  static post(service, endpoint, options = {}, form = false) {
    const body = form ? 'fromData' : 'body';

    return axios(defaultRequest(service.url, endpoint, {
	  method: "post",
      headers: service.headers,
      [body]: options,
    }));
  }

  static put(service, endpoint, options = {}) {
    return axios(defaultRequest(service.url, endpoint, {
	  method: "put",
      headers: service.headers,
      body: options,
    }));
  }

  static delete(service, endpoint, options = {}) {
    return axios(defaultRequest(service.url, endpoint, {
	  method: "delete",
      headers: service.headers,
      qs: options,
    }));
  }
}

export default RequestHelper;
