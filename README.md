# Organiza Mi Día - La App

### Repositorio:

En este repo se encuentra la aplicación de backend desarrollada con Flask (Python), la cual se encarga de obtener y entregar al cliente tanto los datos en formato JSON, como las plantillas HTML y todos los archivos estáticos del frontend.
(Mas adelante haré un frontend separado :)) )

### Configuración:
#### Entorno:

Para conigurar el entorno de trabajo (Deploy o Dev), debe dirigirse al archivo `config/Config.py`
Modifique la propiedad debug_mode:

```python
config = {
    "debug_mode": False
} 
```

#### Conexión a base de datos:

Dirígase al siguiente archivo: `database/data_connection.py`

Modifique las variables con los respectivos datos para conectarse a una base de datos. Los datos en desarrollo se aconseja utilizarlos para una base de datos local.
```python
# In Production:
database_user = "YOUR_USER"
database_passw = "YOUR_PASSWORD"
database_host = "YOUR_HOST"
database_name = "YOUR_DATABASE_NAME"

# In development:
dev_database_user = "root"
dev_database_passw = ""
dev_database_host = "localhost"
dev_database_name = "organizamidia"

```

Para sugerencias, puedes mandarme un
[correo](mailto:joaquin.polivera@gmail.com)