#!/bin/bash

echo "Provisioning virtual machine..."

echo "Installing and updating Ubuntu packages"
apt-get update > /dev/null
apt-get upgrade -y > /dev/null
apt-get install git nginx -y > /dev/null

echo "Setting up default user 'vagrant'"
sudo -H -u vagrant bash -c 'echo "if [ -f ~/.bashrc ]; then" >> ~/.bash_profile'
sudo -H -u vagrant bash -c 'echo "  source ~/.bashrc" >> ~/.bash_profile'
sudo -H -u vagrant bash -c 'echo "fi" >> ~/.bash_profile'

#echo "Downloading and installing Docker"
#wget -qO- https://get.docker.com/ | sh > /dev/null
#usermod -aG docker vagrant > /dev/null

echo "Setting up web folder"
mkdir /srv/www > /dev/null
mkdir /srv/www/webapp > /dev/null
chown vagrant:vagrant /srv/www -R > /dev/null
sudo -H -u vagrant bash -c 'ln -sf /vagrant /srv/www/webapp/current'

echo "Installing NVM"
sudo -H -u vagrant bash -c 'curl https://raw.githubusercontent.com/creationix/nvm/v0.24.1/install.sh | bash' &> /dev/null
sudo -H -u vagrant bash -c 'echo ". ~/.nvm/nvm.sh" >> ~/.bashrc'

echo "Download latest node and set it as default"
sudo -H -u vagrant bash -c '. ~/.nvm/nvm.sh && nvm install stable && nvm alias default stable' &> /dev/null

echo "Installing RVM and latest Ruby"
sudo -H -u vagrant bash -c 'gpg --no-verbose --quiet --keyserver hkp://keys.gnupg.net --recv-keys 409B6B1796C275462A1703113804BB82D39DC0E3' &> /dev/null
sudo -H -u vagrant bash -c '\curl --silent -sSL https://get.rvm.io | bash -s stable --ruby' &> /dev/null
sudo -H -u vagrant bash -c 'echo "source ~/.rvm/scripts/rvm" >> ~/.bashrc'

echo "Installing Gem dependencies"
sudo -H -u vagrant bash -c 'source ~/.rvm/scripts/rvm && gem install bundle' &> /dev/null
sudo -H -u vagrant bash -c 'source ~/.rvm/scripts/rvm && cd /srv/www/webapp/current && bundle install' &> /dev/null

echo "Installing Node dependencies"
sudo -H -u vagrant bash -c '. ~/.nvm/nvm.sh && npm install -g pm2 bower grunt-cli' &> /dev/null
sudo -H -u vagrant bash -c '. ~/.nvm/nvm.sh && cd /srv/www/webapp/current && npm install --ignore-scripts' &> /dev/null

echo "Install Bower dependencies"
sudo -H -u vagrant bash -c '. ~/.nvm/nvm.sh && cd /srv/www/webapp/current && bower install' &> /dev/null
