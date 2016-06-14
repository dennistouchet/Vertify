Installation
	Windows (download and run from):
		https://install.meteor.com/windows
	Linux/OSX
		curl https://install.meteor.com/ | sh	

Verify installation:
	
	meteor --version

Uninstall:
	Windows
		Start Menu -> Program and Features -> Uninstall Meteor
	Linux/OSX
		sudo rm /usr/local/bin/meteor
		rm -rf ~/.meteor

Windows installation directory lives here:

	C:\Users\[Username]\AppData\Local\.meteor


Create new Meteor application template:

	meteor create [app-name]


To run your application simply type 'meteor' in the application directiory:

	Example: C:\dev\meteor\demo-app> meteor


Add additional Meteor packages:

	meteor add [package-name]

	Examples:

		meteor add momentjs:moment
		meteor add session
		meteor add accounts-ui
			(meteor add accounts-password)			
			(meteor add accounts-google)
			(meteor add accounts-facebook)
		meteor add service-configuration


Remove added Meteor packages:
	
	meter remove [package-name]


Check currently installed packages:
	meteor list

To Replace Blaze (Meteor default) with Angular2:

	meteor remove blaze-html-templates
	meteor add angular2-compilers 
	meteor add barbatus:angular2-runtime
	meteor npm install --save angular2-meteor 
	meteor npm install @angular/platform-browser-dynamic
	meteor npm install @angular/router-deprecated

To allow Meteor to Angular binding

	meteor npm install angular2-meteor-auto-bootstrap --save
>this overries @angular/platform-browser-dynamic and adds some additional features

To verify all necessary packages are installed run:

	meteor npm install

To Allow Typescript

	Create the file - tsconfig.json
	
	npm install typings -g
    	typings init
    	typings install es6-promise --save
    	typings install dt~es6-shim --global --save
    	typings install registry:env/meteor --global

