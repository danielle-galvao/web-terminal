import setuptools

with open("README.md", "r") as fh:
    long_description = fh.read()

setuptools.setup(
  name = 'web_terminal',
  packages = ['web_terminal'],
  package_dir = {'': 'server'},
  include_package_data = True,
  version = '0.2.1',
  license = 'BSD3',
  description = 'Web_Terminal is a server that gives an easy web-based interface to a terminal window, with plenty of nice features', #TODO
  long_description=long_description,
  long_description_content_type="text/markdown",
  maintainer = 'John Meyer',
  maintainer_email = 'dev@johnmeyer.dev',
  url = 'https://danielle-galvao.github.io/web-terminal/',
  keywords = ['web', 'terminal'],
  install_requires = [
     #TODO
    'flask',
    'websockets',
  ],
  classifiers = [
    'Development Status :: 3 - Alpha',
    'Environment :: Console',
    'Environment :: Web Environment',
    'Intended Audience :: End Users/Desktop',
    'Intended Audience :: Developers',
    'Intended Audience :: System Administrators',
    #TODO add 'Topic :: '
    'License :: OSI Approved :: BSD License',
    'Programming Language :: Python :: 3', #TODO
    'Programming Language :: Python :: 3.4',
    'Programming Language :: Python :: 3.5',
    'Programming Language :: Python :: 3.6',
  ],
)