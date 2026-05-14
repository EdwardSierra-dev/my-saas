## No title SaaS

### No title section

Este sistema tiene como principal propisito ayudar a crear conexiones entre tiendas y clientes mejorando la calidad de las relaciones y los negocios B2P.

El nicho inicial de la plataforma serán las tiendas de barrio, farmacias, negocios de comida rápida, emprendedores, en general negocios que quieran mantener a sus usuarios/clientes conectados y actualizados.

La plataforma será modular, lo cual permitira a los clientes, dependiendo de su actividad economica y dependiendo al plan que escojan, podran tener o no todos los modulos

## Modulos

### Modulo de inventario

- El modulo de inventario servira para que los customer (tiendas) puedan crear sus productos o servicios para vender a los clientes.

### Modulo de agendamiento de citas

- El modulo le permitira a los clientes llevar un control de citas de los usuarios dependiendo del tipo de negocio. (barberias, peluquerias, consultorias, independientes).

- El la funcionalidad de agendamiento se debe habilitar en los usuarios si solo si el customer (tienda) tiene el modulo activo.

### Modulo de promociones

- El modulo de promociones será solo utilizable para los customer (tiendas) con el fin de enviar promociones y descuentos a los usuarios que hayan comprado en la tienda.

### Modulo de recuperación de usuarios/compradores

- El modulo tiene como objetivo enviarle mensajes o notificaciones a los usuarios con mensajes tentadores para que vuelvan a consumir los productos o servicios de las tiendas que tenga el modulo activado.

### Registro de customers y usuarios

- Los customers se registran con google.

- Al momento de realizar el registro, el customer debe llenar un formularios donde debe indicar que es un customer para que se le habiliten las opciones de tienda.

- Los users se podran registrar con google, con el fin de ya tener los datos para ser captados.

- Al momento de realizar el registro, el user deberá o no llenar un formulario con sus gustos para poder ser utilizados en las recomendaciones.

### Modulo de recomendaciones

- Los users podrán tener recomendaciones de tiendas, productos o servicios dependiendo sus gustos y lo que hayan comprado antes.

### Modulo de calificación

- Los users podrán calificar a los clientes de 1 a 5 estrellas y dejas un comentarios.

- Los customers (tiendas) podran ver los comentarios y calificaciones pero estás serán anonimas.

### Modulo de domicilios

- El customer (tienda) podrá ofrecer domicilio desde la plataforma.

- El domicilio tendra un valor estipulado por el customer (tienda).

### Modulo de chat

- El customer podrá chatear dentro de la misma plataforma con los usuarios que tengan preguntas o dudas, o sea solo si el user escribe primero. luego de 24h el chat se eliminará para el customer

- El users podrá chatear dentro de la misma plataforma con las tiendas que tenga servicios activos. luego de 24h quedará eliminado.

### Pagos

- Buscar la mejor alternativa, porque hay dos opciones
    1. Que sean pagos por nequi y que el usuario mande el comprobante.
    2. Pasarela de pagos creada por nosotros.
    3. WooCommerce o algo parecido.

## Funcionalidades por rol

### Administrator

- El administrador será el actor encargado de habilitar y deshabilitar usuarios y clientes (tienda y compradores).

- Realizará seguimiento del vencimiento de las subcripciones de las tiendas (clientes).

- El administrador podrá ver las tiendas que más interacciones genere por la plataforma.

    - Productos y servicios más vendidos por las tiendas.

- El administrador debe ser creado por base de datos.

- El adminsitrador podrá ver métricas de los usuarios.

    - Productos y servicios más consumidos.

### Customer - Shop/Business

- El customer podrá crear y actualizar sus productos o servicios.

- El customer podra ver las métricas de sus clientes (users) más concurrentes, que es lo que más compra.

- El customer podrá ver los artículos más vendidos.

- El customer podrá crear promociones y descuentos y enviarle a los clientes que ya les hayan comprado.

- El customer podra ver los clientes agendados.

- El customer podrá ver si hay domicilios activos.

- El customer podrá ver las métricas de cuantos ventas fueron con domicilio.

### User

- El usuario podra ver los productos y servicios de las tiendas.

- El usuario podrá ver las promociones y descuentos de las tiendas.

- El usuario podrá ver si historial de compras.

- El usuario podrá ver las tiendas y los productos más comprados.

- El usuario podra tener tiendas, productos y servicios favoritos.

- El user podrá chatear con las tiendas para despejar dudas.
--------------------------------------
ORDEN DE CREACIÓN DE LOS REQUERIMIENTOS.

Auth Module - Tiendas / Usuarios
Business Profile Module - Tiendas
Inventory Module - Tiendas
Promotions Module - Tiendas
Scheduling Module - Tiendas
Delivery Module - Tiendas
Reviews & Ratings Module - Tiendas
Recommendation Module - Tiendas
Analytics Module - Tiendas
Chat Module - Tiendas / Usuarios
Subscription/Billing Module - Tiendas
Notifications Module - Tiendas / Usuarios