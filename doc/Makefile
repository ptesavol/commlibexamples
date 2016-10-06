WEBIDL_FILES := $(wildcard *.webidl)
IDL_FILES := $(WEBIDL_FILES:%.webidl=%.webidl.idl)

all: clean doc cleantemp

%.webidl.idl: %.webidl
	cp $< $@

doc: $(IDL_FILES)
	doxygen

cleantemp:
	rm -f *.webidl.idl

clean:
	rm -rf api	

