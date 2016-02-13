#!/usr/bin/env python

from os.path import dirname, exists, join
import os, sys, subprocess
from setuptools import find_packages, setup

setup_dir = dirname(__file__)
git_dir = join(setup_dir, '.git')
base_package = 'pynetworktables2js'
version_file = join(setup_dir, base_package, 'version.py')

# Automatically generate a version.py based on the git version
if exists(git_dir):
    p = subprocess.Popen(["git", "describe", "--tags", "--long", "--dirty=-dirty"],
                         stdout=subprocess.PIPE,
                         stderr=subprocess.PIPE)
    out, err = p.communicate()
    # Make sure the git version has at least one tag
    if err:
        print("Error: You need to create a tag for this repo to use the builder")
        sys.exit(1)

    # Convert git version to PEP440 compliant version
    # - Older versions of pip choke on local identifiers, so we can't include the git commit
    v, commits, local = out.decode('utf-8').rstrip().split('-', 2)
    if commits != '0' or '-dirty' in local:
        v = '%s.post0.dev%s' % (v, commits)

    # Create the version.py file
    with open(version_file, 'w') as fp:
        fp.write("# Autogenerated by setup.py\n__version__ = '{0}'".format(v))

if exists(version_file):
    with open(version_file, 'r') as fp:
        exec(fp.read(), globals())
else:
    __version__ = "master"

with open(join(setup_dir, 'README.rst'), 'r') as readme_file:
    long_description = readme_file.read()

setup(
    name='pynetworktables2js',
    version=__version__,
    description='RobotPy web-based low fidelity FRC robot simulation package',
    long_description=long_description,
    author='RobotPy Development Team',
    author_email='robotpy@googlegroups.com',
    url='https://github.com/robotpy/pynetworktables2js',
    keywords='frc first robotics networktables',
    packages=find_packages(),
    include_package_data=True,
    zip_safe=False,
    install_requires=[
        'tornado>=4.0',
        'pynetworktables>=2015.2.1'
    ],
    entry_points={'console_scripts': [ 'pynetworktables2js = pynetworktables2js.__main__:main' ]},
    license="BSD License",
    classifiers=[
        "Development Status :: 4 - Beta",
        "Intended Audience :: Developers",
        "Intended Audience :: Education",
        "License :: OSI Approved :: BSD License",
        "Operating System :: OS Independent",
        "Topic :: Scientific/Engineering"
    ]
    )
