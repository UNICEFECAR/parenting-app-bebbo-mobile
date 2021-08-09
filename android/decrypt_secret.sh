{\rtf1\ansi\ansicpg1252\cocoartf2578
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fnil\fcharset0 Menlo-Regular;}
{\colortbl;\red255\green255\blue255;\red189\green198\blue208;}
{\*\expandedcolortbl;;\cssrgb\c78824\c81961\c85098;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\deftab720
\pard\pardeftab720\sl380\partightenfactor0

\f0\fs27\fsmilli13600 \cf2 \expnd0\expndtw0\kerning0
#!/bin/sh\
\
# Decrypt the file\
mkdir $HOME/secrets\
# --batch to prevent interactive command\
# --yes to assume "yes" for questions\
gpg --quiet --batch --yes --decrypt --passphrase="$LARGE_SECRET_PASSPHRASE" \\\
--output $HOME/secrets/pbdebug.keystore pbdebug.keystore.gpg\
}