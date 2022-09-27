package service

import model.{ID, User}

import scala.concurrent.Future

trait UserService {
  def user(email: ID): Future[Option[User]]
}

object UserService {
  val user: User = User(
    email = ID("support@apollographql.com"),
    name = Some("Jane Smith"),
    totalProductsCreated = Some(1337),
    yearsOfEmployment = 10
  )

  private val users = List(user)

  val inMemory: UserService = new UserService {
    override def user(email: ID): Future[Option[User]] = Future.successful(users.find(_.email == email))
  }
}
