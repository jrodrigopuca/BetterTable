# Guía para Publicar better-table en NPM

## Prerrequisitos

1. **Cuenta en NPM**: Crear una cuenta en [npmjs.com](https://www.npmjs.com/signup)
2. **Node.js**: Versión 18 o superior instalada
3. **npm CLI**: Incluido con Node.js

## Paso 1: Verificar que el nombre esté disponible

```bash
npm search better-table
```

Si el nombre `better-table` ya está tomado, deberás usar un scope o nombre alternativo:

- `@tu-usuario/better-table` (scope personal)
- `better-react-table`
- `bettertable`

## Paso 2: Iniciar sesión en NPM

```bash
npm login
```

Se te pedirá:

- Username
- Password
- Email
- One-time password (si tienes 2FA habilitado)

Para verificar que estás logueado:

```bash
npm whoami
```

## Paso 3: Verificar el contenido del paquete

Antes de publicar, revisa qué archivos se incluirán:

```bash
cd better-table
npm pack --dry-run
```

Deberías ver solo los archivos necesarios:

```
dist/
README.md
LICENSE
package.json
```

## Paso 4: Construir la librería

```bash
npm run build
```

Verifica que se generaron los archivos en `dist/`:

- `better-table.es.js` (ES modules)
- `better-table.cjs.js` (CommonJS)
- `better-table.css` (estilos)
- `index.d.ts` (tipos TypeScript)

## Paso 5: Crear archivo LICENSE

Si no existe, crear el archivo LICENSE con Apache 2.0:

```bash
cat > LICENSE << 'EOF'
                                 Apache License
                           Version 2.0, January 2004
                        http://www.apache.org/licenses/

   TERMS AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTION

   1. Definitions.

      "License" shall mean the terms and conditions for use, reproduction,
      and distribution as defined by Sections 1 through 9 of this document.

      "Licensor" shall mean the copyright owner or entity authorized by
      the copyright owner that is granting the License.

      "Legal Entity" shall mean the union of the acting entity and all
      other entities that control, are controlled by, or are under common
      control with that entity. For the purposes of this definition,
      "control" means (i) the power, direct or indirect, to cause the
      direction or management of such entity, whether by contract or
      otherwise, or (ii) ownership of fifty percent (50%) or more of the
      outstanding shares, or (iii) beneficial ownership of such entity.

      "You" (or "Your") shall mean an individual or Legal Entity
      exercising permissions granted by this License.

      "Source" form shall mean the preferred form for making modifications,
      including but not limited to software source code, documentation
      source, and configuration files.

      "Object" form shall mean any form resulting from mechanical
      transformation or translation of a Source form, including but
      not limited to compiled object code, generated documentation,
      and conversions to other media types.

      "Work" shall mean the work of authorship, whether in Source or
      Object form, made available under the License, as indicated by a
      copyright notice that is included in or attached to the work.

      "Derivative Works" shall mean any work, whether in Source or Object
      form, that is based on (or derived from) the Work and for which the
      editorial revisions, annotations, elaborations, or other modifications
      represent, as a whole, an original work of authorship.

      "Contribution" shall mean any work of authorship, including
      the original version of the Work and any modifications or additions
      to that Work or Derivative Works thereof, that is intentionally
      submitted to the Licensor for inclusion in the Work by the copyright owner.

      "Contributor" shall mean Licensor and any individual or Legal Entity
      on behalf of whom a Contribution has been received by Licensor and
      subsequently incorporated within the Work.

   2. Grant of Copyright License. Subject to the terms and conditions of
      this License, each Contributor hereby grants to You a perpetual,
      worldwide, non-exclusive, no-charge, royalty-free, irrevocable
      copyright license to reproduce, prepare Derivative Works of,
      publicly display, publicly perform, sublicense, and distribute the
      Work and such Derivative Works in Source or Object form.

   3. Grant of Patent License. Subject to the terms and conditions of
      this License, each Contributor hereby grants to You a perpetual,
      worldwide, non-exclusive, no-charge, royalty-free, irrevocable
      (except as stated in this section) patent license to make, have made,
      use, offer to sell, sell, import, and otherwise transfer the Work.

   4. Redistribution. You may reproduce and distribute copies of the
      Work or Derivative Works thereof in any medium, with or without
      modifications, and in Source or Object form, provided that You
      meet the following conditions:

      (a) You must give any other recipients of the Work or
          Derivative Works a copy of this License; and

      (b) You must cause any modified files to carry prominent notices
          stating that You changed the files; and

      (c) You must retain, in the Source form of any Derivative Works
          that You distribute, all copyright, patent, trademark, and
          attribution notices from the Source form of the Work; and

      (d) If the Work includes a "NOTICE" text file as part of its
          distribution, then any Derivative Works that You distribute must
          include a readable copy of the attribution notices contained
          within such NOTICE file.

   5. Submission of Contributions. Unless You explicitly state otherwise,
      any Contribution intentionally submitted for inclusion in the Work
      by You to the Licensor shall be under the terms and conditions of
      this License, without any additional terms or conditions.

   6. Trademarks. This License does not grant permission to use the trade
      names, trademarks, service marks, or product names of the Licensor.

   7. Disclaimer of Warranty. Unless required by applicable law or
      agreed to in writing, Licensor provides the Work on an "AS IS" BASIS,
      WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND.

   8. Limitation of Liability. In no event and under no legal theory,
      whether in tort (including negligence), contract, or otherwise,
      shall any Contributor be liable to You for damages, including any
      direct, indirect, special, incidental, or consequential damages.

   9. Accepting Warranty or Additional Liability. While redistributing
      the Work or Derivative Works thereof, You may choose to offer,
      and charge a fee for, acceptance of support, warranty, indemnity,
      or other liability obligations consistent with this License.

   END OF TERMS AND CONDITIONS

   Copyright 2026 Juan Rodrigo Puca

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
EOF
```

## Paso 6: Publicar en NPM

### Primera publicación:

```bash
npm publish
```

### Si usas un scope (@tu-usuario/better-table):

```bash
npm publish --access public
```

## Paso 7: Verificar la publicación

1. Visita `https://www.npmjs.com/package/better-table`
2. Prueba instalar en un proyecto nuevo:

```bash
mkdir test-project && cd test-project
npm init -y
npm install better-table
```

---

## Actualizaciones Futuras

### Incrementar versión

```bash
# Patch (1.0.0 -> 1.0.1) - Bug fixes
npm version patch

# Minor (1.0.0 -> 1.1.0) - Nueva funcionalidad
npm version minor

# Major (1.0.0 -> 2.0.0) - Breaking changes
npm version major
```

### Publicar actualización

```bash
npm run build
npm publish
```

---

## Comandos Útiles

| Comando                                      | Descripción            |
| -------------------------------------------- | ---------------------- |
| `npm whoami`                                 | Ver usuario actual     |
| `npm pack`                                   | Crear tarball local    |
| `npm pack --dry-run`                         | Ver qué se incluirá    |
| `npm info better-table`                      | Ver info del paquete   |
| `npm deprecate better-table@1.0.0 "mensaje"` | Deprecar versión       |
| `npm unpublish better-table@1.0.0`           | Eliminar versión (72h) |

---

## Solución de Problemas

### Error: "You do not have permission to publish"

El nombre ya está tomado. Opciones:

1. Usar un scope: `@tu-usuario/better-table`
2. Elegir otro nombre

### Error: "npm ERR! 402 Payment Required"

Si usas scope, debes hacer público el paquete:

```bash
npm publish --access public
```

### Error: "This package requires 2FA"

Habilita 2FA en tu cuenta de NPM o usa token de automatización.

---

## Checklist Final

- [ ] `npm login` completado
- [ ] `npm run build` exitoso
- [ ] Archivos en `dist/` verificados
- [ ] `LICENSE` creado
- [ ] `package.json` con versión correcta
- [ ] README actualizado
- [ ] Tests pasando (`npm run test:run`)
- [ ] `npm pack --dry-run` muestra solo archivos necesarios
- [ ] `npm publish` ejecutado
