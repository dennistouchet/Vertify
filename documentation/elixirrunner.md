#Installing Elixir Runner Connector Shell Locally

Download Elixir

install erland/Elixir

Clone VertifyObjects

cd Vertify : cmd> mix deps.get

install Hex[yn]? Y

Vertify\apps\elixirrunner> cmd /C iex --name Connectors -S mix

Connectors@ip (ex: 192.168.2.128)

Possible Errors & Solutions:

Unhandled Exception: System.NotSupportedException:
An attempt was made to load an assembly from a network location which would have caused the assembly to be sandboxed in previous versions of the .NET framework.
If this load is not intended to be sandboxed, please enable the loadFromRemoteSources switch. See http://go.microsoft.com/fwlink/?LinkId=155569

Solution:
    In the assembly location (ex: /bin/Release)
    *right-click each .dll and .exe individually
    *select Properties
    *Check the Unblock box located at the bottom in the Security section.
