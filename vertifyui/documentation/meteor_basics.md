*Installation*
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

Windows default installation directory lives here:

	C:\Users\[Username]\AppData\Local\.meteor

Create new Meteor application (template):

	meteor create [app-name]

To run your application simply type 'meteor' in the application directory:

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

To reinstall/refresh all of the packages in the project:

	meteor cache clear
	meteor npm install

To reset the meteor project settings (including the mongodb)

	meteor reset

*To Allow Typescript:*

Create the file *tsconfig.json* in the app root dir
Run the following:

	npm install typings -g
	typings init
	typings install es6-promise --save
	typings install dt~es6-shim --global --save
	typings install registry:env/meteor --global
