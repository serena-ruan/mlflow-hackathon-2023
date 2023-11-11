# MLflow Authentication REST API {#auth-rest-api}

The MLflow Authentication REST API allows you to create, get, update and
delete users, experiment permissions and registered model permissions.
The API is hosted under the `/api` route on the MLflow tracking server.
For example, to list experiments on a tracking server hosted at
`http://localhost:5000`, access
`http://localhost:5000/api/2.0/mlflow/users/create`.

<div class="contents" markdown="1" local="" depth="1">

Table of Contents

</div>

------------------------------------------------------------------------

## Create User {#mlflowAuthServiceCreateUser}

<table style="width:61%;">
<colgroup>
<col style="width: 41%" />
<col style="width: 19%" />
</colgroup>
<thead>
<tr class="header">
<th><blockquote>
<p>Endpoint</p>
</blockquote></th>
<th>HTTP Method</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><code>2.0/mlflow/users/create</code></td>
<td><code>POST</code></td>
</tr>
</tbody>
</table>

### Request Structure {#mlflowCreateUser}

<table style="width:56%;">
<colgroup>
<col style="width: 18%" />
<col style="width: 18%" />
<col style="width: 19%" />
</colgroup>
<thead>
<tr class="header">
<th>Field Name</th>
<th><blockquote>
<p>Type</p>
</blockquote></th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>username</td>
<td><code>STRING</code></td>
<td>Username.</td>
</tr>
<tr class="even">
<td>password</td>
<td><code>STRING</code></td>
<td>Password.</td>
</tr>
</tbody>
</table>

### Response Structure {#mlflowCreateUserResponse}

<table style="width:69%;">
<colgroup>
<col style="width: 18%" />
<col style="width: 27%" />
<col style="width: 23%" />
</colgroup>
<thead>
<tr class="header">
<th>Field Name</th>
<th><blockquote>
<p>Type</p>
</blockquote></th>
<th><blockquote>
<p>Description</p>
</blockquote></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>user</td>
<td><code class="interpreted-text" role="ref">mlflowUser</code></td>
<td>A user object.</td>
</tr>
</tbody>
</table>

------------------------------------------------------------------------

## Get User {#mlflowAuthServiceGetUser}

<table style="width:57%;">
<colgroup>
<col style="width: 37%" />
<col style="width: 19%" />
</colgroup>
<thead>
<tr class="header">
<th><blockquote>
<p>Endpoint</p>
</blockquote></th>
<th>HTTP Method</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><code>2.0/mlflow/users/get</code></td>
<td><code>GET</code></td>
</tr>
</tbody>
</table>

### Request Structure {#mlflowGetUser}

<table style="width:56%;">
<colgroup>
<col style="width: 18%" />
<col style="width: 18%" />
<col style="width: 19%" />
</colgroup>
<thead>
<tr class="header">
<th>Field Name</th>
<th><blockquote>
<p>Type</p>
</blockquote></th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>username</td>
<td><code>STRING</code></td>
<td>Username.</td>
</tr>
</tbody>
</table>

### Response Structure {#mlflowGetUserResponse}

<table style="width:69%;">
<colgroup>
<col style="width: 18%" />
<col style="width: 27%" />
<col style="width: 23%" />
</colgroup>
<thead>
<tr class="header">
<th>Field Name</th>
<th><blockquote>
<p>Type</p>
</blockquote></th>
<th><blockquote>
<p>Description</p>
</blockquote></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>user</td>
<td><code class="interpreted-text" role="ref">mlflowUser</code></td>
<td>A user object.</td>
</tr>
</tbody>
</table>

------------------------------------------------------------------------

## Update User Password {#mlflowAuthServiceUpdateUserPassword}

<table style="width:74%;">
<colgroup>
<col style="width: 54%" />
<col style="width: 19%" />
</colgroup>
<thead>
<tr class="header">
<th><blockquote>
<p>Endpoint</p>
</blockquote></th>
<th>HTTP Method</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><code>2.0/mlflow/users/update-password</code></td>
<td><code>PATCH</code></td>
</tr>
</tbody>
</table>

### Request Structure {#mlflowUpdateUserPassword}

| Field Name | Type     | Description   |
|------------|----------|---------------|
| username   | `STRING` | Username.     |
| password   | `STRING` | New password. |

------------------------------------------------------------------------

## Update User Admin {#mlflowAuthServiceUpdateUserAdmin}

<table style="width:69%;">
<colgroup>
<col style="width: 50%" />
<col style="width: 19%" />
</colgroup>
<thead>
<tr class="header">
<th><blockquote>
<p>Endpoint</p>
</blockquote></th>
<th>HTTP Method</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><code>2.0/mlflow/users/update-admin</code></td>
<td><code>PATCH</code></td>
</tr>
</tbody>
</table>

### Request Structure {#mlflowUpdateUserAdmin}

<table style="width:65%;">
<colgroup>
<col style="width: 18%" />
<col style="width: 19%" />
<col style="width: 27%" />
</colgroup>
<thead>
<tr class="header">
<th>Field Name</th>
<th><blockquote>
<p>Type</p>
</blockquote></th>
<th><blockquote>
<p>Description</p>
</blockquote></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>username</td>
<td><code>STRING</code></td>
<td>Username.</td>
</tr>
<tr class="even">
<td>is_admin</td>
<td><code>BOOLEAN</code></td>
<td>New admin status.</td>
</tr>
</tbody>
</table>

------------------------------------------------------------------------

## Delete User {#mlflowAuthServiceDeleteUser}

<table style="width:61%;">
<colgroup>
<col style="width: 41%" />
<col style="width: 19%" />
</colgroup>
<thead>
<tr class="header">
<th><blockquote>
<p>Endpoint</p>
</blockquote></th>
<th>HTTP Method</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><code>2.0/mlflow/users/delete</code></td>
<td><code>DELETE</code></td>
</tr>
</tbody>
</table>

### Request Structure {#mlflowDeleteUser}

<table style="width:56%;">
<colgroup>
<col style="width: 18%" />
<col style="width: 18%" />
<col style="width: 19%" />
</colgroup>
<thead>
<tr class="header">
<th>Field Name</th>
<th><blockquote>
<p>Type</p>
</blockquote></th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>username</td>
<td><code>STRING</code></td>
<td>Username.</td>
</tr>
</tbody>
</table>

------------------------------------------------------------------------

## Create Experiment Permission {#mlflowAuthServiceCreateExperimentPermission}

<table style="width:86%;">
<colgroup>
<col style="width: 66%" />
<col style="width: 19%" />
</colgroup>
<thead>
<tr class="header">
<th><blockquote>
<p>Endpoint</p>
</blockquote></th>
<th>HTTP Method</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><code>2.0/mlflow/experiments/permissions/create</code></td>
<td><code>POST</code></td>
</tr>
</tbody>
</table>

### Request Structure {#mlflowCreateExperimentPermission}

<table style="width:90%;">
<colgroup>
<col style="width: 22%" />
<col style="width: 36%" />
<col style="width: 31%" />
</colgroup>
<thead>
<tr class="header">
<th><blockquote>
<p>Field Name</p>
</blockquote></th>
<th><blockquote>
<p>Type</p>
</blockquote></th>
<th><blockquote>
<p>Description</p>
</blockquote></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>experiment_id</td>
<td><code>STRING</code></td>
<td>Experiment id.</td>
</tr>
<tr class="even">
<td>username</td>
<td><code>STRING</code></td>
<td>Username.</td>
</tr>
<tr class="odd">
<td>permission</td>
<td><code class="interpreted-text"
role="ref">mlflowPermission</code></td>
<td>Permission to grant.</td>
</tr>
</tbody>
</table>

### Response Structure {#mlflowCreateExperimentPermissionResponse}

<table style="width:99%;">
<colgroup>
<col style="width: 25%" />
<col style="width: 37%" />
<col style="width: 36%" />
</colgroup>
<thead>
<tr class="header">
<th><blockquote>
<p>Field Name</p>
</blockquote></th>
<th><blockquote>
<p>Type</p>
</blockquote></th>
<th><blockquote>
<p>Description</p>
</blockquote></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>experiment_permission</td>
<td><code class="interpreted-text"
role="ref">mlflowExperimentPermission</code></td>
<td>An experiment permission object.</td>
</tr>
</tbody>
</table>

------------------------------------------------------------------------

## Get Experiment Permission {#mlflowAuthServiceGetExperimentPermission}

<table style="width:82%;">
<colgroup>
<col style="width: 62%" />
<col style="width: 19%" />
</colgroup>
<thead>
<tr class="header">
<th><blockquote>
<p>Endpoint</p>
</blockquote></th>
<th>HTTP Method</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><code>2.0/mlflow/experiments/permissions/get</code></td>
<td><code>GET</code></td>
</tr>
</tbody>
</table>

### Request Structure {#mlflowGetExperimentPermission}

<table style="width:64%;">
<colgroup>
<col style="width: 22%" />
<col style="width: 18%" />
<col style="width: 23%" />
</colgroup>
<thead>
<tr class="header">
<th><blockquote>
<p>Field Name</p>
</blockquote></th>
<th><blockquote>
<p>Type</p>
</blockquote></th>
<th><blockquote>
<p>Description</p>
</blockquote></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>experiment_id</td>
<td><code>STRING</code></td>
<td>Experiment id.</td>
</tr>
<tr class="even">
<td>username</td>
<td><code>STRING</code></td>
<td>Username.</td>
</tr>
</tbody>
</table>

### Response Structure {#mlflowGetExperimentPermissionResponse}

<table style="width:99%;">
<colgroup>
<col style="width: 25%" />
<col style="width: 37%" />
<col style="width: 36%" />
</colgroup>
<thead>
<tr class="header">
<th><blockquote>
<p>Field Name</p>
</blockquote></th>
<th><blockquote>
<p>Type</p>
</blockquote></th>
<th><blockquote>
<p>Description</p>
</blockquote></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>experiment_permission</td>
<td><code class="interpreted-text"
role="ref">mlflowExperimentPermission</code></td>
<td>An experiment permission object.</td>
</tr>
</tbody>
</table>

------------------------------------------------------------------------

## Update Experiment Permission {#mlflowAuthServiceUpdateExperimentPermission}

<table style="width:86%;">
<colgroup>
<col style="width: 66%" />
<col style="width: 19%" />
</colgroup>
<thead>
<tr class="header">
<th><blockquote>
<p>Endpoint</p>
</blockquote></th>
<th>HTTP Method</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><code>2.0/mlflow/experiments/permissions/update</code></td>
<td><code>PATCH</code></td>
</tr>
</tbody>
</table>

### Request Structure {#mlflowUpdateExperimentPermission}

<table style="width:96%;">
<colgroup>
<col style="width: 22%" />
<col style="width: 36%" />
<col style="width: 37%" />
</colgroup>
<thead>
<tr class="header">
<th><blockquote>
<p>Field Name</p>
</blockquote></th>
<th><blockquote>
<p>Type</p>
</blockquote></th>
<th><blockquote>
<p>Description</p>
</blockquote></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>experiment_id</td>
<td><code>STRING</code></td>
<td>Experiment id.</td>
</tr>
<tr class="even">
<td>username</td>
<td><code>STRING</code></td>
<td>Username.</td>
</tr>
<tr class="odd">
<td>permission</td>
<td><code class="interpreted-text"
role="ref">mlflowPermission</code></td>
<td>New permission to grant.</td>
</tr>
</tbody>
</table>

------------------------------------------------------------------------

## Delete Experiment Permission {#mlflowAuthServiceDeleteExperimentPermission}

<table style="width:86%;">
<colgroup>
<col style="width: 66%" />
<col style="width: 19%" />
</colgroup>
<thead>
<tr class="header">
<th><blockquote>
<p>Endpoint</p>
</blockquote></th>
<th>HTTP Method</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><code>2.0/mlflow/experiments/permissions/delete</code></td>
<td><code>DELETE</code></td>
</tr>
</tbody>
</table>

### Request Structure {#mlflowDeleteExperimentPermission}

<table style="width:64%;">
<colgroup>
<col style="width: 22%" />
<col style="width: 18%" />
<col style="width: 23%" />
</colgroup>
<thead>
<tr class="header">
<th><blockquote>
<p>Field Name</p>
</blockquote></th>
<th><blockquote>
<p>Type</p>
</blockquote></th>
<th><blockquote>
<p>Description</p>
</blockquote></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>experiment_id</td>
<td><code>STRING</code></td>
<td>Experiment id.</td>
</tr>
<tr class="even">
<td>username</td>
<td><code>STRING</code></td>
<td>Username.</td>
</tr>
</tbody>
</table>

------------------------------------------------------------------------

## Create Registered Model Permission {#mlflowAuthServiceCreateRegisteredModelPermission}

<table style="width:94%;">
<colgroup>
<col style="width: 75%" />
<col style="width: 19%" />
</colgroup>
<thead>
<tr class="header">
<th><blockquote>
<p>Endpoint</p>
</blockquote></th>
<th>HTTP Method</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><code>2.0/mlflow/registered-models/permissions/create</code></td>
<td><code>CREATE</code></td>
</tr>
</tbody>
</table>

### Request Structure {#mlflowCreateRegisteredModelPermission}

<table style="width:89%;">
<colgroup>
<col style="width: 18%" />
<col style="width: 36%" />
<col style="width: 34%" />
</colgroup>
<thead>
<tr class="header">
<th>Field Name</th>
<th><blockquote>
<p>Type</p>
</blockquote></th>
<th><blockquote>
<p>Description</p>
</blockquote></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>name</td>
<td><code>STRING</code></td>
<td>Registered model name.</td>
</tr>
<tr class="even">
<td>username</td>
<td><code>STRING</code></td>
<td>Username.</td>
</tr>
<tr class="odd">
<td>permission</td>
<td><code class="interpreted-text"
role="ref">mlflowPermission</code></td>
<td>Permission to grant.</td>
</tr>
</tbody>
</table>

### Response Structure {#mlflowCreateRegisteredModelPermissionResponse}

<table style="width:99%;">
<colgroup>
<col style="width: 26%" />
<col style="width: 36%" />
<col style="width: 35%" />
</colgroup>
<thead>
<tr class="header">
<th><blockquote>
<p>Field Name</p>
</blockquote></th>
<th><blockquote>
<p>Type</p>
</blockquote></th>
<th><blockquote>
<p>Description</p>
</blockquote></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>registered_model_permission</td>
<td><code class="interpreted-text"
role="ref">mlflowRegisteredModelPermission</code></td>
<td>A registered model permission object.</td>
</tr>
</tbody>
</table>

------------------------------------------------------------------------

## Get Registered Model Permission {#mlflowAuthServiceGetRegisteredModelPermission}

<table style="width:90%;">
<colgroup>
<col style="width: 70%" />
<col style="width: 19%" />
</colgroup>
<thead>
<tr class="header">
<th><blockquote>
<p>Endpoint</p>
</blockquote></th>
<th>HTTP Method</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><code>2.0/mlflow/registered-models/permissions/get</code></td>
<td><code>GET</code></td>
</tr>
</tbody>
</table>

### Request Structure {#mlflowGetRegisteredModelPermission}

<table style="width:71%;">
<colgroup>
<col style="width: 18%" />
<col style="width: 18%" />
<col style="width: 34%" />
</colgroup>
<thead>
<tr class="header">
<th>Field Name</th>
<th><blockquote>
<p>Type</p>
</blockquote></th>
<th><blockquote>
<p>Description</p>
</blockquote></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>name</td>
<td><code>STRING</code></td>
<td>Registered model name.</td>
</tr>
<tr class="even">
<td>username</td>
<td><code>STRING</code></td>
<td>Username.</td>
</tr>
</tbody>
</table>

### Response Structure {#mlflowGetRegisteredModelPermissionResponse}

<table style="width:99%;">
<colgroup>
<col style="width: 26%" />
<col style="width: 36%" />
<col style="width: 35%" />
</colgroup>
<thead>
<tr class="header">
<th><blockquote>
<p>Field Name</p>
</blockquote></th>
<th><blockquote>
<p>Type</p>
</blockquote></th>
<th><blockquote>
<p>Description</p>
</blockquote></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>registered_model_permission</td>
<td><code class="interpreted-text"
role="ref">mlflowRegisteredModelPermission</code></td>
<td>A registered model permission object.</td>
</tr>
</tbody>
</table>

------------------------------------------------------------------------

## Update Registered Model Permission {#mlflowAuthServiceUpdateRegisteredModelPermission}

<table style="width:94%;">
<colgroup>
<col style="width: 75%" />
<col style="width: 19%" />
</colgroup>
<thead>
<tr class="header">
<th><blockquote>
<p>Endpoint</p>
</blockquote></th>
<th>HTTP Method</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><code>2.0/mlflow/registered-models/permissions/update</code></td>
<td><code>PATCH</code></td>
</tr>
</tbody>
</table>

### Request Structure {#mlflowUpdateRegisteredModelPermission}

<table style="width:92%;">
<colgroup>
<col style="width: 18%" />
<col style="width: 36%" />
<col style="width: 37%" />
</colgroup>
<thead>
<tr class="header">
<th>Field Name</th>
<th><blockquote>
<p>Type</p>
</blockquote></th>
<th><blockquote>
<p>Description</p>
</blockquote></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>name</td>
<td><code>STRING</code></td>
<td>Registered model name.</td>
</tr>
<tr class="even">
<td>username</td>
<td><code>STRING</code></td>
<td>Username.</td>
</tr>
<tr class="odd">
<td>permission</td>
<td><code class="interpreted-text"
role="ref">mlflowPermission</code></td>
<td>New permission to grant.</td>
</tr>
</tbody>
</table>

------------------------------------------------------------------------

## Delete Registered Model Permission {#mlflowAuthServiceDeleteRegisteredModelPermission}

<table style="width:94%;">
<colgroup>
<col style="width: 75%" />
<col style="width: 19%" />
</colgroup>
<thead>
<tr class="header">
<th><blockquote>
<p>Endpoint</p>
</blockquote></th>
<th>HTTP Method</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><code>2.0/mlflow/registered-models/permissions/delete</code></td>
<td><code>DELETE</code></td>
</tr>
</tbody>
</table>

### Request Structure {#mlflowDeleteRegisteredModelPermission}

<table style="width:71%;">
<colgroup>
<col style="width: 18%" />
<col style="width: 18%" />
<col style="width: 34%" />
</colgroup>
<thead>
<tr class="header">
<th>Field Name</th>
<th><blockquote>
<p>Type</p>
</blockquote></th>
<th><blockquote>
<p>Description</p>
</blockquote></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>name</td>
<td><code>STRING</code></td>
<td>Registered model name.</td>
</tr>
<tr class="even">
<td>username</td>
<td><code>STRING</code></td>
<td>Username.</td>
</tr>
</tbody>
</table>

## Data Structures {#auth-rest-struct}

### User {#mlflowUser}

<table style="width:99%;">
<colgroup>
<col style="width: 20%" />
<col style="width: 34%" />
<col style="width: 44%" />
</colgroup>
<thead>
<tr class="header">
<th><blockquote>
<p>Field Name</p>
</blockquote></th>
<th><blockquote>
<p>Type</p>
</blockquote></th>
<th><blockquote>
<p>Description</p>
</blockquote></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>id</td>
<td><code>STRING</code></td>
<td>User ID.</td>
</tr>
<tr class="even">
<td>username</td>
<td><code>STRING</code></td>
<td>Username.</td>
</tr>
<tr class="odd">
<td>is_admin</td>
<td><code>BOOLEAN</code></td>
<td>Whether the user is an admin.</td>
</tr>
<tr class="even">
<td>experiment_permissions</td>
<td>An array of <code class="interpreted-text"
role="ref">mlflowExperimentPermission</code></td>
<td>All experiment permissions explicitly granted to the user.</td>
</tr>
<tr class="odd">
<td>registered_model_permissions</td>
<td>An array of <code class="interpreted-text"
role="ref">mlflowRegisteredModelPermission</code></td>
<td>All registered model permissions explicitly granted to the
user.</td>
</tr>
</tbody>
</table>

### Permission {#mlflowPermission}

Permission of a user to an experiment or a registered model.

<table style="width:78%;">
<colgroup>
<col style="width: 23%" />
<col style="width: 54%" />
</colgroup>
<thead>
<tr class="header">
<th><blockquote>
<p>Name</p>
</blockquote></th>
<th><blockquote>
<p>Description</p>
</blockquote></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>READ</td>
<td>Can read.</td>
</tr>
<tr class="even">
<td>EDIT</td>
<td>Can read and update.</td>
</tr>
<tr class="odd">
<td>MANAGE</td>
<td>Can read, update, delete and manage.</td>
</tr>
<tr class="even">
<td>NO_PERMISSIONS</td>
<td>No permissions.</td>
</tr>
</tbody>
</table>

### ExperimentPermission {#mlflowExperimentPermission}

<table style="width:89%;">
<colgroup>
<col style="width: 22%" />
<col style="width: 36%" />
<col style="width: 30%" />
</colgroup>
<thead>
<tr class="header">
<th><blockquote>
<p>Field Name</p>
</blockquote></th>
<th><blockquote>
<p>Type</p>
</blockquote></th>
<th><blockquote>
<p>Description</p>
</blockquote></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>experiment_id</td>
<td><code>STRING</code></td>
<td>Experiment id.</td>
</tr>
<tr class="even">
<td>user_id</td>
<td><code>STRING</code></td>
<td>User id.</td>
</tr>
<tr class="odd">
<td>permission</td>
<td><code class="interpreted-text"
role="ref">mlflowPermission</code></td>
<td>Permission granted.</td>
</tr>
</tbody>
</table>

### RegisteredModelPermission {#mlflowRegisteredModelPermission}

<table style="width:89%;">
<colgroup>
<col style="width: 18%" />
<col style="width: 36%" />
<col style="width: 34%" />
</colgroup>
<thead>
<tr class="header">
<th>Field Name</th>
<th><blockquote>
<p>Type</p>
</blockquote></th>
<th><blockquote>
<p>Description</p>
</blockquote></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>name</td>
<td><code>STRING</code></td>
<td>Registered model name.</td>
</tr>
<tr class="even">
<td>user_id</td>
<td><code>STRING</code></td>
<td>User id.</td>
</tr>
<tr class="odd">
<td>permission</td>
<td><code class="interpreted-text"
role="ref">mlflowPermission</code></td>
<td>Permission granted.</td>
</tr>
</tbody>
</table>
