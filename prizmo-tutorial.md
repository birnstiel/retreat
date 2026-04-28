
# PRIZMO Tutorial

*Hands-on session — Monday, April 27, 16:30*

&nbsp;

### Instructions

Installing PRIZMO:

1. Clone the repository:

   ```
   git clone https://github.com/tgrassi/prizmo.git
   ```

2. Create a virtual environment and install the requirements:

   ```
   cd prizmo
   ```
   ```
   pip install virtualenv
   ```
   ```
   python -m venv env
   ```
   ```
   source env/bin/activate
   ```
   ```
   pip install -r requirements.txt
   ```

3. Install a Fortran compiler:

   - Linux:
     ```
     sudo apt install gfortran
     ```
   - Non-Linux users: Follow the instructions at [https://fortran-lang.org/learn/os_setup/install_gfortran/](https://fortran-lang.org/learn/os_setup/install_gfortran/)
