# Guía de Testing - SIGA

## ⚠️ Solución al Error de PowerShell

Si ves el error "running scripts is disabled on this system", sigue estos pasos:

### Opción 1: Cambiar Política de Ejecución (Recomendado)
1. Abre PowerShell como **Administrador** (clic derecho → "Ejecutar como administrador")
2. Ejecuta:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```
3. Confirma con "S" (Sí)
4. Cierra y vuelve a abrir PowerShell normal

### Opción 2: Usar CMD en su lugar
1. Abre **CMD** (Command Prompt) en lugar de PowerShell
2. Navega al proyecto:
```cmd
cd "c:\Users\harol\OneDrive\Escritorio\SISTEMAS INVENTARIO\SIGA"
```
3. Ejecuta los comandos normalmente

---

## 📦 Paso 1: Instalar Dependencias

```bash
npm install date-fns jspdf jspdf-autotable xlsx chart.js
```

**Dependencias instaladas:**
- `date-fns` - Formateo de fechas (usado en notificaciones, comentarios)
- `jspdf` + `jspdf-autotable` - Exportación a PDF
- `xlsx` - Exportación a Excel
- `chart.js` - Gráficos (Pareto en análisis ABC)

---

## 🚀 Paso 2: Iniciar Servidor de Desarrollo

```bash
npm run dev
```

El servidor debería iniciar en: `http://localhost:9002/`

---

## ✅ Paso 3: Testing de Funcionalidades Nuevas

### 3.1 Sistema de Notificaciones

1. **Abrir la aplicación** en el navegador
2. **Verificar el header** - Debe aparecer el ícono de campana con badge
3. **Click en la campana** - Debe abrir el centro de notificaciones
4. **Verificar notificaciones iniciales** - Deben aparecer 3 notificaciones de ejemplo
5. **Probar acciones:**
   - Marcar como leída (botón check)
   - Eliminar notificación (botón X)
   - Marcar todas como leídas

**Resultado esperado:** 
- Badge actualiza el contador
- Notificaciones cambian de color al marcar como leídas
- Navegación funciona al hacer click en notificación

---

### 3.2 Componentes de Inventario

#### DialogAjusteInventario
**Cómo probar:**
1. Ir a **Inventario**
2. *Nota: Necesita integración - El botón aún no está agregado*
3. Para probar manualmente, agregar temporalmente en InventarioPage.vue:

```vue
<q-btn 
  color="warning" 
  icon="tune" 
  label="Ajuste de Inventario"
  @click="mostrarDialogAjuste = true"
/>

<DialogAjusteInventario
  v-model="mostrarDialogAjuste"
  :items="inventario"
  @ajuste-registrado="handleAjuste"
/>
```

**Funcionalidades a verificar:**
- Selección de item muestra cantidad actual
- Cálculo automático de diferencia
- Alerta para ajustes grandes (>10 unidades)
- Validación de campos obligatorios

#### DialogLoteSerie
**Funcionalidades a verificar:**
- Tabs de Lotes y Series funcionan
- Agregar lote con fecha de vencimiento
- Cálculo automático de estado (Vigente/Por Vencer/Vencido)
- Agregar número de serie con estado
- Tabla muestra lotes/series agregados
- Eliminar lotes/series

---

### 3.3 Componentes de Préstamos

#### DialogRenovacion
**Funcionalidades a verificar:**
- Muestra información del préstamo actual
- Validación de nueva fecha (debe ser futura)
- Justificación obligatoria
- Alerta si ya tiene múltiples renovaciones

#### MultasTable
**Funcionalidades a verificar:**
- Resumen de multas (Total, Pendientes, Pagadas)
- Configuración de tarifas
- Tabla con estados de multas
- Acciones: Pagar, Condonar, Ver Detalle
- Badges de colores por estado

#### DialogReserva
**Funcionalidades a verificar:**
- Selección de equipo
- Calendario de disponibilidad
- Verificación de conflictos
- Validación de horarios
- Tabla de reservas del usuario
- Conversión de reserva a préstamo

---

### 3.4 Componentes de Proveedores

#### CalificacionProveedor
**Funcionalidades a verificar:**
- 4 criterios de calificación (estrellas)
- Cálculo automático de promedio
- Comentarios opcionales
- Validación (al menos 1 criterio calificado)

#### DialogContrato
**Funcionalidades a verificar:**
- Formulario completo de contrato
- Validación de fechas (fin > inicio)
- Cálculo de días para vencer
- Alertas de vencimiento (colores)
- Subida de documentos
- Tabla de contratos existentes

---

### 3.5 Componentes de Solicitudes

#### ComentariosSection
**Funcionalidades a verificar:**
- Interfaz estilo chat
- Agregar comentario
- Formato de fecha relativa ("hace 2 minutos")
- Diferenciación visual (propios vs. otros)
- Scroll automático

#### HistorialCambios
**Funcionalidades a verificar:**
- Timeline visual
- Iconos por tipo de acción
- Colores por estado
- Formato de fecha relativa
- Muestra comentarios y detalles

---

### 3.6 Componentes de Reportes

#### KardexReport
**Funcionalidades a verificar:**
- Información del item
- Filtros por fecha y tipo de movimiento
- Tabla de movimientos con colores
- Resumen: Total Entradas, Salidas, Saldo
- Botones de exportación (mostrarán alerta simulada)

#### ABCReport
**Funcionalidades a verificar:**
- Clasificación automática (A, B, C)
- Resumen por categoría con porcentajes
- Tabla con porcentaje acumulado
- Progress bars por clasificación
- Recomendaciones de gestión
- Badges de colores (A=rojo, B=naranja, C=verde)

---

## 🐛 Problemas Conocidos y Soluciones

### Error: "date-fns is not defined"
**Solución:** Instalar dependencias:
```bash
npm install date-fns
```

### Error: "Cannot find module 'jspdf'"
**Solución:** Las exportaciones PDF/Excel están simuladas. Instalar:
```bash
npm install jspdf jspdf-autotable xlsx
```

### Componentes no aparecen
**Causa:** Los componentes nuevos aún no están integrados en las páginas.
**Solución:** Necesitan ser importados y agregados a las páginas correspondientes.

---

## 📝 Checklist de Testing

### Funcionalidades Básicas
- [ ] Aplicación inicia sin errores
- [ ] Navegación entre páginas funciona
- [ ] Sistema de notificaciones visible en header
- [ ] Badge de notificaciones muestra contador

### Notificaciones
- [ ] Centro de notificaciones abre/cierra
- [ ] Notificaciones iniciales se cargan
- [ ] Marcar como leída funciona
- [ ] Eliminar notificación funciona
- [ ] Contador actualiza correctamente

### Componentes Visuales
- [ ] Modales usan BaseModal (diseño consistente)
- [ ] Formularios tienen validación
- [ ] Tablas muestran datos correctamente
- [ ] Badges y colores son apropiados
- [ ] Iconos son relevantes

### Funcionalidad
- [ ] Validaciones funcionan
- [ ] Cálculos automáticos correctos
- [ ] Alertas se muestran apropiadamente
- [ ] Acciones (guardar, cancelar) funcionan

---

## 🎯 Próximos Pasos Después del Testing

1. **Corregir errores encontrados**
2. **Integrar componentes en páginas** (siguiente fase)
3. **Conectar con backend Laravel** (cuando esté listo)
4. **Testing de integración completo**

---

## 💡 Notas Importantes

- **Datos Simulados:** Todos los componentes usan datos de ejemplo
- **Exportaciones:** PDF/Excel mostrarán alertas hasta instalar librerías
- **Notificaciones:** Se cargan automáticamente al iniciar la app
- **Validaciones:** Funcionan en frontend, backend agregará validaciones adicionales

---

**¿Encontraste algún error? Documéntalo con:**
- Página donde ocurrió
- Acción que causó el error
- Mensaje de error (si hay)
- Comportamiento esperado vs. real
