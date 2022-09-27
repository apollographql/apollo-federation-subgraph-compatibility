package service

import model._

import scala.concurrent.Future

trait ProductResearchService {
  def productResearch(studyCaseNumber: ID): Future[Option[ProductResearch]]
}

object ProductResearchService {
  private val productResearch1 = ProductResearch(CaseStudy(ID("1234"), Some("Federation Study")))
  private val productResearch2 = ProductResearch(CaseStudy(ID("1235"), Some("Studio Study")))
  private val productResearches: List[ProductResearch] = List(productResearch1, productResearch2)

  val inMemory: ProductResearchService = new ProductResearchService {
    override def productResearch(studyCaseNumber: ID): Future[Option[ProductResearch]] =
      Future.successful(productResearches.find(_.study.caseNumber == studyCaseNumber))
  }
}
