# Inventory module

## Operations Screen

- El sistema debe mostrar un título en la pantalla de operaciones que dirá: Productos/Servicios
- El sistema debe mostrar una tabla con ls sigueintes columnas:
    - Nombre
    - Precio
    - Tipo
    - Costo
    - Stock
- El sistema puede recomendar el precio del artículo dependiendo del costo, sería un valor adicional entre el 20% y el 35%.
- Al hacer clic en cada producto se debe abrir un modal donde se muestra la información del artículo y la foto.
- Desde ese modal y desde el registro de artículos y servicios se puede agregar la foto.
- Para eliminar los productos se debe hacer un doble check, al momento de eliminar el producto debe aparecer un modal que diga "type eliminar" para poder eliminarlo.

## Products creation form

- Al lado del título del modulo, dentro del screen operations, se debe crear un boton que tendra el siguiente texto: "+ Crear"
- Al momento de hacer clicn en el botón se debe abrir un formulario dentro de un modal con los siguienetes datos:
    - Titulo: Formulario de creación de artículos / Productos
    - Nombre
    - Precio
    - Costo, puede ir vacio
    - Cantidad, puede ur vacio
    - Checkbox, alerta de stock minimo, una vez seleccionado este check se debe mostrar en pantalla otro input que permite el ingreso del valor minimo.
        - La alearte de valor minimo debe aparecer luego de:
            - Vender el artículo y que llegué a su valor minimo.
            - Al entrar al modulo de inventario debe aparecer el modal con todos los artículos que stá proximos a acabarse.
            - Al iniciar la sesión.
- Al final debe haber un boton que diga "Crear".