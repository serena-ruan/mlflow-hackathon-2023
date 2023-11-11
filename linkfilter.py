#!/usr/bin/env python

import panflute as pf

link_rep = False

def convert_hyperlink_targets(elem, doc):

    if isinstance(elem, pf.Code):
        if ("interpreted-text" in elem.classes
            and "role" in elem.attributes
            and elem.attributes["role"] == "ref"):
            # check if it's in the form `text <link>`
            components = elem.text.split("<")
            if len(components) == 1:
                link_text = components[0]
                link_href = components[0]
            else:
                link_text = components[0].strip()
                link_href = components[1][:-1]
            return [pf.Link(pf.Str(link_text), url=f"#{link_href}")]
            

def main(doc=None):
    return pf.run_filter(convert_hyperlink_targets, doc=doc)

if __name__ == '__main__':
    main()