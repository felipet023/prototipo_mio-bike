# Matriz de requisitos no funcionales

| RNF | Descripción | Estado | Evidencia |
|---|---|---|---|
| RNF-01 | Usabilidad y consistencia | Implementado | UI TUKI BIKES, mensajes en español |
| RNF-02 | Responsive | Implementado | CSS responsive 768px |
| RNF-03 | Rendimiento catálogo | Implementado | Consultas indexadas, build OK |
| RNF-04 | Protección admin | Implementado | `authorize('admin')` backend |
| RNF-05 | Contraseñas con hash | Implementado | bcrypt, tests |
| RNF-06 | Integridad de datos | Implementado | PK/FK/CHECK/UNIQUE |
| RNF-07 | Disponibilidad en pruebas | Implementado | Servidores arrancan correctamente |
| RNF-08 | Código modular/mantenible | Implementado | Capas routes/controllers/services |
| RNF-09 | Compatibilidad navegadores | Parcial | React estándar, pruebas manuales |
| RNF-10 | Mensajes comprensibles | Implementado | Mensajes en español |
| RNF-11 | Arquitectura ampliable | Implementado | Módulos independientes |
| RNF-12 | Ejecución local | Implementado | README y scripts |