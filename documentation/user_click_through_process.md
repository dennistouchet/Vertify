# Create a Workspace

  1a. Click the Workspace dropdown in the top navigation bar
    i. Click on 'Click here to add a new workspace'

  1b. OR Select *Workspace* under the *Admin* section in the side navigation

  2a. Enter a name for the workspace in the _workspace name_ field
      i. Click *+ Add*
      ii. This should automatically take you to the *Setup Page*
      iii. Skip to Step 3

  2b. OR Click the *+ New Workspace* button
      i. A modal window titled 'Add a Workspace' should appear
      ii. Enter a name for the workspace in the _workspace name_ field
      iii. Click *Save*
      iv. Click the *Setup* in the side navigation

# Connect - Adding Systems

  3a. On the Setup Page Click *Connect to your Systems*
  3b. OR Click *Connect* under *Setup* in the side navigation menu

  4. Create a system
    i.    Select a System from the system dropdown
          a. depending on the Systems Connector requirements, several extra fields will appear.
            For more information on these fields and what to enter here, see index 1
    ii.   Fill in all of the System fields.
    iii.  Click *+ Add*

  5. Creating additional Systems

    i.    Click *+ Connect System*
    ii.   Select a System from the system dropdown
            a. depending on the Systems Connector requirements, several extra fields will appear.
            For more information on these fields and what to enter here, see index 1
    iii.  Fill in all of the System fields.
    iv.   Click *Add System*

  6. Click button *Next: Collect Objects >*

  `Note: _At Least_ Two Systems need to be created to complete Connect`

# Collect - Adding External ObjectsList

  Note: System External Objects will not appear until the Authentication, Discover, and Scan tasks have completed.
        You can verify a system has been Authenticated by the color coded status on the System Object on the Connect page.

  7. Create an External Object

    ia. Click on the desired System External Object

    ib. OR click the System External Object dropdown
        b. Select desired System External Object from the list

  8. Creating additional External Objects

    ia. Click on the desired System External Object

    ib. OR click the System External Object dropdown
        b. Select desired System External Object from the list

  9. Click button *Next: Match Objects >*

  `Note: _At Least_ Two External Objects need to be created to complete Collect`

# Match - Creating a Vertify Object and matching records

  10. Click *+ Add Custom Vertify Object*

  11. Select *Create A New Veritfy Object* and Click *Next >*

  12. Select Two (2) different Systems from the dropdown lists and Click *Next >*
    i. order is unimportant

  12. Select *Vertify All Records* radio options and Click *Next >*

  13. Select the field from both External Objects that you would like to Match
    i. Ex: Email and LeadRecord.Email

  14. Select *Exact* from Match % dropdown and Click *Next >*

  15. Enter a name for you VertifyObject, select a System of Truth, and Click *Next >*
    i This should create a new Vertify Object, and it should appear in the Vertify Object list

  16. In the *Actions* dropdown menu select *Match*

  17. Select *Match first 100* option and Click *Match*

  18. The Match Results page should display the match results when they are complete.

  19. Click Approve match

  20. In the modal, click Confirm Match

# Align - Creating Vertify Properties

  21. In the *Actions* dropdown menu select *Align*

  22. Select *Match first 100* option and Click *Align*

  23. The Align Results page should display the align results when they are complete.

  24. Click Approve Alignment

  25. In the modal, click Confirm Alignment

# Analyze - Monitoring your Vertify ObjectsList

  26. In the *Actions* dropdown menu select *Enable*

  27. System will run analysis

# Fix - Resolving Vertify Object issues

  28. Click *Actions* dropdown menu select *details*

  29. Click *Fix Unmatched*

  30. Click Confirm Fix

  31. Waiting for loading to Complete

  32. DONE!

#Index

1. System connector credential fields

  I.  Netsuite

    a. username: sstark@thenewoffice.com

    b. password: Vertify1234!

    c. api key:   

    d. ApplicationId: 03259A74-5CB8-4016-8635-20EDD72BE23A

    e. AccountNumber: TSTDRV534421

    f. ReleasePreview: N

    g. IncludeSavedSearches: N

    h. Sandbox: N

    i. SetExternalId: N

  II.  Netsuite

    a. username: chowe@thenewoffice.com

    b. password: Vertify1234!

    c. api key:   

    d. ApplicationId: 03259A74-5CB8-4016-8635-20EDD72BE23A

    e. AccountNumber: TSTDRV935064

    f. ReleasePreview: N

    g. IncludeSavedSearches: N

    h. Sandbox: N

    i. SetExternalId: N
