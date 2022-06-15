FROM nginx:alpine
MAINTAINER CLink

RUN ln -sf /dev/stdout /var/log/nginx/access.log
RUN ln -sf /dev/stderr /var/log/nginx/error.log

RUN mkdir -p /app/web/clink-finance/
COPY ./build /app/web/clink-finance/

RUN chmod -R 777 /app/web/clink-finance/

COPY ./nginx.conf /etc/nginx/nginx.conf
EXPOSE 443 80
CMD sh -c "exec nginx -g 'daemon off;'"