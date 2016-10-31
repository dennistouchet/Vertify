##Connect Page
    click - .sysddlbtn
    click - #Netsuite
    enter field -> Prefix ->
    enter field -> Max Concurrent Tasks ->
    enter field -> login ->
    enter field -> password ->
    enter field -> api key ->
    click - button .Add

    click - .addModal
    click - .sysddlbtn
    click - #Marketo
    enter field -> Prefix ->
    enter field -> Max Concurrent Tasks ->
    enter field -> username ->
    enter field -> password ->
    click - button #save

    click - .toCollect

##Collect Page

    click - #objddlbtn
    click - .objlistddl li a data-id="Netsuite Customer"

    click - #objddlbtn
    click - .objlistddl li a data-id="Marketo LeadRecord"

    click - .toMatch

##Match Page

    click - .addCustom
    click - .next
    *wait 1 second*
    click - .extobjddlbtn1
    click - .objddl1 li a Netsuite Customer
    click - .extobjddlbtn2
    click - .objddl2 li a Netsuite Customer
    click - .next
    *wait 1 second*
    click - .next
    click - .propertyddl1
    click - .fieldddl li a email
    click - .propertyddl2
    click - .fieldddl li a Email
    click - .matchPercent
    click - .percentddl li a Exact

##Align Page
