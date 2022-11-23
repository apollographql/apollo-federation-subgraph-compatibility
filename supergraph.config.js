module.exports = {
    apps : [{
      name   : "subgraph inventory",
      script : "index.js",
      cwd: "./subgraphs/inventory",
      wait_ready: true
    },{
      name   : "subgraph users",
      script : "index.js",
      cwd: "./subgraphs/users",
      wait_ready: true
    // TODO cannot specify multiple rover dev commands as they have to run sequentially
    // },{
    //   name: "rover dev products",
    //   script : "rover",
    //   args: "dev --name products --schema implementations/apollo-server/products.graphql --url http://localhost:4001"
    // },{
    //   name: "rover dev users",
    //   script : "rover",
    //   args: "dev --name users --schema subgraphs/users/users.graphql --url http://localhost:4002"
    // },{
    //   name: "rover dev inventory",
    //   script : "rover",
    //   args: "dev --name inventory --schema subgraphs/inventory/inventory.graphql --url http://localhost:4003"
    }]
  }