import { BaseService, RequestHelper } from '../infrastructure';

class ProtectedBranches extends BaseService {
  all(projectId, options) {
    const pId = encodeURIComponent(projectId);

    return RequestHelper.get(this, `projects/${pId}/protected_branches`, options);
  }

  protect(projectId, branchName, options) {
    const pId = encodeURIComponent(projectId);

    return RequestHelper.post(this, `projects/${pId}/protected_branches`, {
      name: branchName,
      ...options,
    });
  }

  show(projectId, branchName) {
    const pId = encodeURIComponent(projectId);

    return RequestHelper.get(this, `projects/${pId}/protected_branches/${branchName}`);
  }

  unprotect(projectId, branchName) {
    const pId = encodeURIComponent(projectId);

    return RequestHelper.delete(this, `projects/${pId}/protected_branches/${branchName}`);
  }
}

export default ProtectedBranches;
