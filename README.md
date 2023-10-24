# Usage
1. Go to https://lehre.bpm.in.tum.de/~ge47qut/v3/build/
2. [Optional] Click the cocktail browser button to check what cocktails are available
3. Say the name of your favorite cocktail (note comments below)
4. Say "engage" to complete/confirm the order
5. Done, a message has been sent to the process engine


### Issue fixes

Firstly, you have to have a microphone connected and allow the website to use it.

If you are using Firefox webspeech is disabled by default, so you may need to set the appropiate flags in _**about:config**_. 

_**media.webspeech.recognition.enable**_
_**media.webspeech.recognition.force_enable**_
_**media.webspeech.synth.enabled**_

Using Firefox Nightly version 72 or newer supports it ([[1]](https://wiki.mozilla.org/Web_Speech_API_-_Speech_Recognition), [[2]](https://stackoverflow.com/questions/39784986/speechrecognition-is-not-working-in-firefox)). 

Chrome and Chromium based browsers should support it by default.

### Comment
You may also access the previous version at https://lehre.bpm.in.tum.de/~ge47qut/cocktail/






# Install
Due to react file linkage and reference problems, the same set of files cannot both be run locally and on the server. This is why there are two repositories.
1. https://github.com/dcqe/static-speech/
2. https://github.com/dcqe/react-speech/

The first one is minimally newer (it fixes the bug in which the process engine is continually notified about the same cocktail being ordered) whereas the second one is the only one that can be run locally. To see which repo you are currently viewing, see the URL.


To run it on your local machine, execute the following commands with [nodejs](https://nodejs.org/en) and [npm](https://www.npmjs.com/) installed.
```
npm install
http-server
```
and then open
```
http://127.0.0.1:8080
```


# Lab report (short version)
This section is a short overview over the project. A more in depth review (with references) can be found in <tt>`/lab-report.pdf`</tt>.

The system features speech recognition via a SpeechRecognition object that is automatically instantiated depending on the browsers implemented interface. This facilitates the creation of a transcript of everything being spoken into the microphone. Additionally, on page load the CSV file of all available cocktails is being parsed. With that, on every speech event the text is being checked if it contains the name of any cocktail or one of its synonyms. If that is the case, the cocktail name is sent to the process engine. 