# Modulo de auth

## Registro / Business / Customers

### General

- Este menú debe hacerse con las mejores practicas de UI/UX enfocados al tipo de proyecto que se está realizando.

#### Web / App

- Al iniciar la app se deben mostrar dos botones, (tienda y cliente), con borde radio.
- Se debe mostrar debajo de los botons un enlace con la frase "Ya tienes cuenta"
- En la parte de abajo de el login, sin llegar a ser el footer, mostrar el logo de app en svg.
- Debajo del logo de la app en un texto un poco más pequeño debe aparecer el desarrollador de la app "eJSc"
- Debajo del nombre del desarrollador.
- Cuando se de clic en botón tienda, deben aparecer 3 opciones, una debajo de la otra, donde apareceran los enlaces para enlazar las cuentas de (Google, Microsoft y LinkedIn).
- Luego de seleccionar la cuenta con la que se registraran el sistema debe abrir un formulario y traer los datos de la cuenta.
- El formulario debe tener los siguientes campos:
    - email: Correo con el que están haciendo el registro.
    - nombre: Nombre o nombre de usuario de la cuenta. * Se puede cambiar
    - Negocio: Una lista con los tipos de negocio (barberia/peluqueria, spa, tienda, restaurante, farmacia, independientes)
    - Ciudad: campo de texto
    - Departamento: Los de colombia
    - Teléfono: Debe ser un número de 10 digitos.
    - Dirección: opcional, pero debe recomendar colocar la dirección si ofrecen servicios en sitios.
    - Password y confirmar password: Debe tener las especificaciones mínimas estandar de seguridad.
- El sistema debe mostrar un modal con el mensaje de confirmación "Se ha registrado exitosamente" debe mostrar un timer de 5s y también debe tener la opción de cerrar el moda.


#### Recomendaciones para la App

- Las opciones en la app deben ser las mismas, lo que se debe tener en cuenta es adecuarlo responsive.

### Selección de modulos / Configuración de modulos.

- Despues de hacer el registro exitoso de las tiendas y negocios y que aparezca el modal de registro exitoso / bienvenido el sistema debe hacer lo siguiente:

    - Mostrar un nuevo modal, puedes reutilizar el componente, pero en este modal vas a mostrar los siguientes mensajes, que el usuario podrá pasar con ayuda de un botón next que se encontrara en la parte inferior derecha:

        - "Selecciona los modulos que más se ajustan a tu negocio"
        - "Centraliza la operación de tu negocio en un solo lugar"
        - "El control de la operaciòn al alcance de tu mano"

    - El modal debe mostrar el avance de los mensajes, es decir con cada mensaje el punto debe ir cambiado de posicion para indicar cuantos mensajes hacen falta.

    - Luego de estár en el último mensaje, el botón de siguiente debe cambiar a "Empecemos!"

- Luego de que el usuario presione empecemos, el sistema debe mostro otro modal con los siguientes checkbox; los cuales serán los modulos que el cliente configurará para su negocio.

    - Inventory Module > $6 USD/month
    - Promotions Module > $4 USD/month
    - Scheduling Module > $5 USD/month
    - Delivery Module > $6 USD/month
    - Reviews & Ratings Module > $3 USD/month
    - Recommendation Module > $5 USD/month
    - Analytics Module > $7 USD/month
    - Chat Module > $5 USD/month

- En la parte de abajo debe aparecer un label o un texto con el total del costo de la aplicación con los modulos que la tienda escoja.

- También en la parte de abajo debe aparecer un botón continuar.

- Luego de dar continuar aparecera otro modal con la siguiente info:
    - El valor total de la configuración que seleccionó el cliente.
    - Un texto que tendrá la siguiente leyenda:
        - Tendras 15 días de prueba totalmente gratis, luego de este tiempo no padras utilizar los servicios y nos contacteremos contigo via correo electrónico.