VAGRANT_API_VERSION = "2"
 
Vagrant.configure(VAGRANT_API_VERSION) do |config|

  config.vm.box = "ubuntu/trusty64"

  config.vm.network "private_network", type: "dhcp"
  
  config.vm.network "forwarded_port", guest: 3001, host: 3001 # Development server

  config.vm.provider "virtualbox" do |vb|
    vb.memory = "4096"
    vb.name = "node-webapp"
    vb.cpus = 1
  end

  config.vm.provision "shell", path: "config/provision.sh"
end