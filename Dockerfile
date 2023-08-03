FROM ubuntu/apache2:2.4-21.10_beta

RUN sed -i -r 's/([a-z]{2}.)?archive.ubuntu.com/old-releases.ubuntu.com/g' /etc/apt/sources.list
RUN sed -i -r 's/security.ubuntu.com/old-releases.ubuntu.com/g' /etc/apt/sources.list

RUN apt-get update
RUN apt-get install -y supervisor vim curl python3-flask python3-requests python3-jwt 
RUN apt-get install -y python3-xhtml2pdf

COPY config/vhost/000-default.conf /etc/apache2/sites-available/

COPY src /var/www/
RUN rm -f /var/www/api/jwt_keys/*

COPY src/api /var/www/files/api_0aca881eb4_prod_v42_src
RUN rm -f /var/www/files/api_0aca881eb4_prod_v42_src/jwt_keys/*


COPY config/supervisor/nodaemon.conf /etc/supervisor/conf.d/
COPY config/supervisor/flask.conf /etc/supervisor/conf.d/

ENV ADMIN_IP="DEADBEEFLULZ"
ENV LEAK_DOMAIN="whistleblower.internal"
ENV LEAK_ID="leaks_455eb376c2edff9e08b7.json"

RUN a2enmod headers proxy proxy_http
RUN a2dismod status

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s CMD curl http://localhost/

CMD echo '127.0.0.1 files.internal whistleblower.internal' >> /etc/hosts; service apache2 restart; supervisord
