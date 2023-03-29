import caliban.federation.v2x._

package object models
    extends FederationV2(
      Versions.v2_3 :: List(
        Link("https://myspecs.dev/myCustomDirective/v1.0", List(Import("@custom"))),
        ComposeDirective("@custom")
      )
    )
    with FederationDirectivesV2_3
