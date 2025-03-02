FROM debian:bullseye-slim

RUN apt-get update && apt-get install -y curl

# Install Bun
RUN curl -fsSL https://bun.sh/install | bash

# Create a new user
ARG USERNAME=dev
ARG USER_UID=1000
ARG USER_GID=$USER_UID

RUN groupadd --gid $USER_GID $USERNAME \
  && useradd --uid $USER_UID --gid $USER_GID -m $USERNAME \
  && mkdir -p /home/$USERNAME/.bun \
  && chown -R $USERNAME:$USERNAME /home/$USERNAME/.bun

# Switch to new user
USER $USERNAME

# Update environment for new user
ENV BUN_INSTALL="/home/$USERNAME/.bun"
ENV PATH="$BUN_INSTALL/bin:$PATH"
