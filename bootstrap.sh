#!/usr/bin/env bash

sudo apt-get install -y curl build-essential software-properties-common python-software-properties

## Go get a recent version of Pip (Ubuntu's is horribly outdated)
cd /vagrant/
curl -O https://bootstrap.pypa.io/get-pip.py
sudo python get-pip.py

# Set up to get a backported version of PHP 5.4.10
sudo add-apt-repository ppa:ondrej/php5-oldstable
sudo apt-get update

# Go install Apache and PHP
sudo apt-get -q -y install php5-gd apache2 php5
sudo apt-get -q -y install curl libcurl3 libcurl3-dev php5-curl

# We'll need PIL to create image tiles and a whole load of other stuff...
sudo apt-get install -y python-dev libjpeg-dev libjpeg8-dev libpng3 libfreetype6-dev
sudo n -s /usr/lib/i386-linux-gnu/libfreetype.so /usr/lib
sudo ln -s /usr/lib/i386-linux-gnu/libjpeg.so /usr/lib
sudo ln -s /usr/lib/i386-linux-gnu/libz.so /usr/lib
sudo pip install PIL  --allow-unverified PIL --allow-all-external
sudo python /vagrant/deepzoom.py/setup.py

# Configure apache to look at the correct folder, and enable symlinks
rm -rf /var/www
ln -fs /vagrant/www /var/www
a2enmod rewrite
sed -i '/AllowOverride None/c AllowOverride All' /etc/apache2/sites-available/default
service apache2 restart

# Install DeepZoom generator tool
cd /vagrant/deepzoom.py
python setup.py install

cd /

echo 'And away we go...'