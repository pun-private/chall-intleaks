FROM ubuntu/apache2:2.4-21.10_beta

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

EXPOSE 80
EXPOSE 5000

ENV ADMIN_IP="DEADBEEFLULZ"
ENV LEAK_DOMAIN="whistleblower.internal"

RUN a2enmod headers proxy proxy_http

CMD echo '127.0.0.1 files.internal whistleblower.internal' >> /etc/hosts; service apache2 restart; supervisord
