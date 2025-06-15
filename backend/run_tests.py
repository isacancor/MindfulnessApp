#!/usr/bin/env python
"""
Script simplificado para ejecutar tests en Windows.
"""
import os
import sys
import subprocess

def run_tests():
    """Ejecuta los tests usando el Python del entorno virtual."""
    try:
        # Usar el Python del entorno virtual directamente
        python_exe = os.path.join('venv', 'Scripts', 'python.exe')
        
        if not os.path.exists(python_exe):
            print("❌ Error: No se encontró el entorno virtual en venv/Scripts/")
            return False
        
        # Configurar variable de entorno para Django
        env = os.environ.copy()
        env['DJANGO_SETTINGS_MODULE'] = 'tests.test_settings'
        
        # Comando simplificado para tests
        cmd = [
            python_exe, '-m', 'pytest',
            'tests/',
            '-v',
            '--tb=short'
        ]
        
        print("🧪 Ejecutando tests...")
        print(f"Comando: {' '.join(cmd)}")
        print("-" * 60)
        
        result = subprocess.run(cmd, env=env, cwd=os.path.dirname(os.path.abspath(__file__)))
        return result.returncode == 0
        
    except Exception as e:
        print(f"❌ Error ejecutando tests: {e}")
        return False

def run_specific_test(test_file):
    """Ejecuta un test específico."""
    try:
        python_exe = os.path.join('venv', 'Scripts', 'python.exe')
        
        # Configurar variable de entorno para Django
        env = os.environ.copy()
        env['DJANGO_SETTINGS_MODULE'] = 'tests.test_settings'
        
        cmd = [
            python_exe, '-m', 'pytest',
            test_file,
            '-v',
            '--tb=short'
        ]
        
        print(f"🧪 Ejecutando: {test_file}")
        print("-" * 60)
        
        result = subprocess.run(cmd, env=env, cwd=os.path.dirname(os.path.abspath(__file__)))
        return result.returncode == 0
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    if len(sys.argv) == 1:
        # Ejecutar todos los tests
        success = run_tests()
        if success:
            print("\n✅ Tests completados exitosamente!")
        else:
            print("\n❌ Algunos tests fallaron.")
            
    elif len(sys.argv) == 2:
        # Ejecutar test específico
        test_arg = sys.argv[1]
        
        if test_arg in ["autenticacion", "usuario", "programa", "sesion", "cuestionario"]:
            test_file = f"tests/test_api/test_{test_arg}_api.py"
        else:
            test_file = test_arg
            
        success = run_specific_test(test_file)
        if not success:
            sys.exit(1)
    else:
        print("Uso:")
        print("  python run_tests.py                    # Todos los tests")
        print("  python run_tests.py autenticacion      # Tests de auth")
        print("  python run_tests.py usuario            # Tests de usuario")
        print("  python run_tests.py programa           # Tests de programa") 