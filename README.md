# svc-qualtrics-converter

PREREQUISITE:

  Node.js should be installed on the machine.
  Installer can be found on https://nodejs.org/en/download/

Should work on both: Windows and Linux OS

INSTALLING DEPENDENCIES:

  1. Open the Command Promt or any other Command Line Interface (Run "cmd.exe" or type cmd via Windows Search)
  2. Navigate to "svc-qualtrics-converter" root folder (type command: "cd 'full path to svc-qualtrics-converter'" and press 'Enter')
  3. Type command: "npm install" and press Enter
  4. After successful installation "node_modules" folder with installed dependencies should appear in the current (root) directory.

RUNNING THE SERVICE:

   1. Open the Command Promt or any other Command Line Interface (Run "cmd.exe" or type cmd via Windows Search)
   2. Navigate to folder containing "server.js" file (type command: "cd 'folder path'" and press 'Enter')
   3. Type: "node server.js" and press 'Enter'
   4. Keep the terminal opened (closing the terminal will result in stopping the service)

ACCESSING THE SERVICE:

  1. Open any web browser
  2. Access service at http://localhost:8081

RUNNING TESTS:
  
  - Tests can be run via "npm test" command from the root folder directory
  - Tests result will be printed to the console





Qualtrics Survey File (*.qsf) :

  A brief explanation of a .qsf file content can be found on: https://gist.github.com/ctesta01/d4255959dace01431fb90618d1e8c241

Question types support:

  Currently service supports:
    - radio ("MC") question types
    - text ("TE") question types
    - range ("Slider") question types

Adding/extending question types support:

  Questions are processed by a "src/qsfConverter.js" file. New/existing questions types support can be easily added/extended via "src/qsfConverter.js" file. If you take a look at the file, there are few functions: 
    - "performQuestionTypeSpecificProcessing" - function for determining the question type
    - "process<QuestionType>Question" - function for processing a specific question type, eg. ("processSliderQuestion")
    - "performGeneralProcessing" - function for general questions processing.
     
  As questions type specific processing logic is quite simple, there were no need to separate it into different files/classes. However, if the logic grows/becomes more complex, it can be easily done. For now if there is a need to add support to other question types, function "performQuestionTypeSpecificProcessing" should be extended and then a new function for processing that question type has to be added.

Interesting notes & problems encountered:

  While developing the service, a problem with questions ordering was faced. Then qualtrics survey is exported to a *.qsf file, the questions might appear in a different order. Therefore, before processing them, initial order has to be recovered. This is done by taking the order of survey question elements from the "BL" qsf node, which stands for "Survey Block" and contains all the questions ID in their initial order. 