## Setup


1. `export CHANGE_MINIKUBE_NONE_USER` 
2. `minikube start`
3. `npm i` (this will also run a `postinstall` that  will build the base project assets and push the images into `minikube`)
    - `npm run build` - compiles typescript code and composes supergraph SDL
    - `npm run docker` - build docker images for `graph-router`, `users` and `inventory`
    - `npm run minikube:load` - load docker images for `graph-router`, `users` and `inventory` to `minikube`
    - `npm run minikube:deploy` - apply deployment yaml files for `graph-router`, `users`, `inventory` to minikube
    - `npm run minikube:expose` - expose ports for deployments
4. `minikube tunnel` - _note this is required for an external-ip to get assigned_
5. `npm run minikube:ip:graph-router` _(optional)_- this is how you can get the IP address of the graph router running in minikube. There are also similar commands for `users` and `inventory`

## Running the Test


