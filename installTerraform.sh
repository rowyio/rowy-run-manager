echo $PWD
$(sudo curl -fsSLO https://raw.githubusercontent.com/warrensbox/terraform-switcher/release/install.sh)
sudo chmod +x ./install.sh
sudo ./install.sh
tfswitch -u -b /bin
#sudo ln -sf $HOME/bin/terraform /usr/local/bin/terraform
#gcloud config set project $GOOGLE_CLOUD_PROJECT
#gcloud config set run/region $GOOGLE_CLOUD_REGION
