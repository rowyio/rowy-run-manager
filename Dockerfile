
FROM node:14-slim
# Create and change to the app directory.
WORKDIR /workdir

RUN \
# Update
apt-get update -y && \
# Install Unzip
apt-get install unzip -y && \
# need wget
apt-get install wget -y && \
# vim
apt-get install vim -y && \
# Install Git
apt-get install git -y

################################
# Install Terraform
################################

# Download terraform for linux
RUN wget https://releases.hashicorp.com/terraform/1.0.11/terraform_1.0.11_linux_amd64.zip

# Unzip
RUN unzip terraform_1.0.11_linux_amd64.zip

# Move to local bin
RUN mv terraform /usr/local/bin/
# Check that it's installed
RUN terraform --version 

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure copying both package.json AND package-lock.json (when available).
# Copying this first prevents re-running npm install on every code change.
COPY package*.json ./
COPY . ./
# Install production dependencies.
# If you add a package-lock.json, speed your build by switching to 'npm ci'.
# RUN npm ci --only=production
#apt-get install -y gnupg software-properties-common curl terraform

#RUN apt-add-repository "deb [arch=amd64] https://apt.releases.hashicorp.com $(lsb_release -cs) main"
RUN yarn
RUN npx tsc
RUN yarn build

# Copy local code to the container image.
#RUN ./installTerraform.sh

# RUN tfswitch -u -b /bin
# RUN ln -sf $HOME/bin/terraform /usr/local/bin/terraform


# Run the web service on container startup.
CMD [ "yarn", "start" ]