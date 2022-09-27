package model

case class User(
    email: ID,
    name: Option[String],
    totalProductsCreated: Option[Int],
    yearsOfEmployment: Int
) {
  def averageProductsCreatedPerYear: Option[Int] =
    totalProductsCreated.map(_ / yearsOfEmployment)
}
