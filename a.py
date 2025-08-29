x = 3
y = 23

# Suma
suma = x + y

# Resta
resta = y - x

# Multiplicación
multiplicacion = x * y

# División (evitando división por cero)
if x != 0:
    division = y / x
else:
    division = None

# Comprobación de paridad
if suma % 2 == 0:
    paridad = "par"
else:
    paridad = "impar"

print("Suma:", suma)
print("Resta:", resta)
print("Multiplicación:", multiplicacion)
print("División:", division)
print(f"La suma es {paridad}")