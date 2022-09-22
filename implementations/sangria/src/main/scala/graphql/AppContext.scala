package graphql

import service.{ProductResearchService, ProductService, UserService}

trait AppContext {
  def productService: ProductService
  def productResearchService: ProductResearchService
  def userService: UserService
}
