MWF.xApplication.portal.PageDesigner = MWF.xApplication.portal.PageDesigner || {};
MWF.APPPOD = MWF.xApplication.portal.PageDesigner;
MWF.APPPOD.LP = {
    "title": "PageEditor",
    "newPage": "Create Page",
    "property": "Property",
    "tools": "Tools",
    "all": "All",

    "repetitionsId": "Element ID is not unique",
    "notNullId": "Element ID cannot be empty",

    "button":{
        "ok": "OK",
        "cancel": "Cancel"
    },

    "notice": {
        "save_success": "Page saved successfully!",
        "saveTemplate_success": "Page template saved successfully!",
        "saveTemplate_inputName": "Please enter the template title",
        "saveTemplate_inputCategory": "Please confirm the template category",

        "deleteElementTitle": "Delete form element confirmation",
        "deleteElement": "Are you sure you want to delete the current element and its child elements?",

        "deleteRowTitle": "Delete table row confirmation",
        "deleteRow": "Deleting the current row will delete the contents of all cells in this row. Are you sure you want to delete the currently selected row?",
        "deleteColTitle": "Delete table column confirmation",
        "deleteCol": "Deleting the current row will delete the contents of all cells in this column. Are you sure you want to delete the currently selected column?",
        "deleteEventTitle": "Delete Event Confirmation",
        "deleteEvent": "Are you sure you want to delete the current event?",

        "deleteActionTitle": "Delete Action Confirmation",
        "deleteAction": "Are you sure you want to delete the current action?",

        "deleteButtonTitle": "Delete Operation Confirmation",
        "deleteButton": "Are you sure you want to delete the current operation button?",

        "notUseModuleInMobile": "The mobile terminal does not support this component",

        "changeToSequenceTitle": "Confirm",
        "changeToSequence": "This operation will delete the added components. Are you sure you want to change it to the \"Sequence Number\" column?",

        "selectPage" : "Select Page",
        "selectWidget" : "Select Widget",

        "widgetNameEmpty": "Enter widget name",
        "widgetNameConflict" : "Widget name conflict",
        "widget_save_success" : "Widget saved successfully"
    },

    "formAction": {
        "insertRow": "Insert Row",
        "insertCol": "Insert Column",
        "deleteRow": "Delete Row",
        "deleteCol": "Delete column",
        "mergerCell": "Merge Cells",
        "splitCell": "Split Cell",
        "move": "Move",
        "copy": "Copy",
        "delete": "Delete",
        "add": "Add",
        "script": "Script",
        "styleBrush": "StyleBrush",
        "insertTop": "Insert Top",
        "insertBottom": "Insert to the bottom",
        "insertBefore": "InsertBefore",
        "insertAfter": "Insert After",
        "injectNotice": "Hold down Ctrl and release the mouse for precise positioning",

        "makeWidget" : "Set as widget",
        "defaultWidgetName" : "widget"
    },

    "actionbar": {
        "readhide": "Set whether to display when reading",
        "edithide": "Set whether to display when editing",
        "hideCondition": "Set hiding conditions",
        "title": "Title",
        "img": "Icon",
        "action": "Action",
        "condition": "Display Condition",

        "editScript": "Action Script Editing",
        "editCondition": "Hide condition editing (return true to hide operation)",
        "up": "Move up",
        "property": "Property",
        "addCustomTool": "Add custom Action",
        "delete": "Delete",
        "setProperties": "Set action properties",
        "restoreDefaultTool": "Restore deleted system Actions",
        "selectDefaultTool": "Select System Action",
        "setReaded": "Mark as read",
        "readed": "Readed"
    },
    "isSave": "Saving, please wait...",
    "validation": {
        "validation": "Validation",
        "anytime": "Anytime",
        "decision": "Choose Decision",
        "decisionName": "<decision name>",
        "value": "Value",

        "length": "ValueLength",
        "valueInput": "<value>",
        "isnull": "isnull",
        "notnull": "Notnull",
        "gt": "GreaterThan",
        "lt": "LessThan",
        "equal": "equal",
        "neq": "NotEqual",
        "contain": "Contain",
        "notcontain": "Notcontain",
        "prompt": "Prompt",
        "add": "Add",
        "modify": "Modify",
        "when": "When ",
        "as": "",

        "inputDecisionName": "Please enter the name of the decision",
        "inputValue": "Please enter a value",
        "inputPrompt": "Please enter the prompt content",
        "delete_title": "Delete confirmation",
        "delete_text": "Are you sure you want to delete this verification code?"
    },
    "datagrid" : {
        "import": "Import",
        "export": "export"
    },

    "selectIcon": "Select Icon",
    "selectImage": "Select Image",
    "selectApplication": "Select Application",
    "dutyInputTitle": "Add title parameter",
    "dutyInput": "Please select Unit for duty \"{duty}\"",
    "select": "Select",
    "empty": "Empty",

    "creatorUnit": "Author Unit",
    "currentUnit": "Task Unit",
    "selectUnit": "Select Unit",
    "scriptUnit": "Use script",

    "creatorCompany": "Drafting Company",
    "creatorDepartment": "Drafting Department",
    "currentCompany": "Current Company",
    "currentDepartment": "Current Department",

    "deleteDutyTitle": "Remove job confirmation",
    "deleteDutyText": "Are you sure you want to remove the duty \"{duty}\"?",

    "saveTemplate": "Save as a form template",
    "templateName": "Name",
    "templateCategory": "Category",
    "templateDescription": "Description",
    "save": "Save",
    "cancel": "Cancel",
    "newCategory": "New Category",
    "mustSelectFormStyle": "You must select a form style",
    "notValidJson": "Wrong json format",

    "filter": {
        "and": "and",
        "or": "Or",
        "equals": "Equals",
        "notEquals": "NotEquals",
        "greaterThan": "GreaterThan",
        "greaterThanOrEqualTo": "GreaterThanEqual",
        "lessThan": "LessThan",
        "lessThanOrEqualTo": "LessThanEqual",
        "like": "Match",
        "notLike": "NotMatch",
        "from": "From",
        "value": "value"
    },

    "mastInputPath": "Enter Data Path",
    "mastInputTitle": "Enter Title",
    "delete_filterItem_title": "Confirm Delete Filter Condition",
    "delete_filterItem": "Are you sure you want to delete the current filter?",

    "checkFormSaveError": "Unable to save the page for the following reasons:<br>",

    "implodeError": "The format of the data to be imported is incorrect",
    "implodeEmpty": "Please fill in the data to be imported in the edit box",
    "implodeConfirmTitle": "Import Confirmation",
    "implodeConfirmText": "Importing data will clear the current page and cannot be undone. Are you sure you want to import it?",

    "subpageNameConflictTitle": "Subpage Field Name Conflict",
    "subpageNameConflictInfor": "The following field names of the subpage conflict with the existing page:\n{name}",
    "subpageConflictTitle": "Subform Embedding Error",
    "subpageConflictInfor": "You cannot embed the same subpage repeatedly",

    "subpageNestedTitle": "Subpage Embedding Error",
    "subpageNestedInfor": "Embedded subpages that cannot be nested within each other",
    "checkSubpageNestedError" : "The subpages you selected are nested in each other, please check!",

    "checkSubpageTitle": "Page save check",
    "checkSubpagePcInfor": "The following subfield conflicts in the PC page: <br>{subform}<br>",
    "checkSubpageMobileInfor": "On the Mobile page, the following subfields conflict:<br>{subform}",

    "design": "Design",
    "script": "Script",
    "html": "HTML",
    "css": "CSS",
    "byModule": "By Element",
    "byPath": "By Type",
    "events": "Events",
    "pageform": "Page",
    "importO2": "Import from O2 data",
    "importHTML": "Import from HTML",
    "importOffice": "Import from WORD or EXCEL",

    "importO2_infor": "Please copy the form data in O2 format to the following editor. (Use the \"Export\" button on the toolbar of the form or page designer to get the form data). Press Ctrl+Alt+I Formatable data",
    "importHTML_infor": "Please copy the HTML data to the following editor. Press Ctrl+Alt+I to format the data",
    "importHTML_infor2": "Please copy the CSS data to the following editor. Press Ctrl+Alt+I to format the data",
    "importOffice_infor": "Please select a Word or Excel file.",
    "import_ok": "Import",
    "import_cancel": "Cancel",
    "import_option1": "Add an input box to an empty cell in the table",
    "import_option2": "Remove empty elements",
    "implodeOfficeEmpty": "Please select the Word or Excel file to import first",

    "scriptTitle": {
        "validationOpinion": "Form Opinion Verification",
        "validationRoute": "Form routing verification",
        "validationFormCustom": "Form Validation",
        "defaultValue": "Default Value",
        "validation": "Validation Script",
        "sectionByScript": "Section ByScript",
        "itemScript": "Optional value script",
        "iframeScript": "iframeScript",
        "labelScript": "Text Value",
        "rangeKey": "Unit Range",
        "identityRangeKey": "Identity Unit Range",
        "unitRangeKey": "Unit Selection Range",
        "rangeDutyKey": "Duty Range",
        "exclude": "Exclude Script",
        "cookies": "Data source requests cookies",
        "requestBody": "Data source request message body",
        "jsonText": "Data Text",
        "dataScript": "Tree Control Script",
        "itemDynamic": "Dynamic Option Script",
        "defaultData": "Data grid default value",
        "editableScript": "Is editable",
        "config": "HTML editer configuration",
        "filterScript": "Record filtering",
        "readScript": "Office Read-Only Script",
        "fileSite": "Office file site script",
        "subformScript": "Subform Script",
        "selectedScript": "View Selection Script",
        "action.tools": "Action Button"
    },
    "selectorButton" : {
        "ok" : "OK",
        "cancel" : "Cancel"
    },

    "modules": {
        "label": "Label",
        "textfield": "Textfield",
        "number": "Number",
        "org": "Org",
        "calendar": "Calendar",
        "textarea": "Textarea",
        "select": "Select",
        "radio": "Radio",
        "checkbox": "Checkbox",
        "combox": "Combox",
        "opinion": "Opinion",
        "button": "Button",
        "Address": "Address",
        "Actionbar": "Actionbar",
        "Sidebar": "Sidebar",
        "image": "Image",
        "imageclipper": "Imageclipper",
        "attachment": "Attachment",
        "div": "Div",
        "table": "Table",
        "datagrid": "Datagrid(Deprecated)",
        "datatable": "Datatable",
        "datatemplate": "Datatemplate",
        "subform": "Subform",
        "ViewSelector": "ViewSelector",
        "view": "View",
        "stat": "Stat",
        "html": "HTML",
        "common": "Common",
        "tab": "Tab",
        "tree": "Tree",
        "log": "Log",
        "monitor": "Monitor",
        "iframe": "Iframe",
        "documenteditor": "Documenteditor",
        "htmledit": "Htmleditor",
        "office": "Office",
        "statementSelector": "StatementSelector",
        "statement": "Statement",
        "source": "DataSource",
        "subSource": "SubSource",
        "sourceText": "SourceText",
        "widget": "Widget",
        "widgetmodules": "WidgetEl",
        "address": "Address",
        "importer": "DataImport",
        "SmartBI":"SmartBI"
    },
    "filedConfigurator": {
        "sequence": "Sequence",
        "fieldTitle": "Field Title",
        "fieldId": "Field ID",
        "action": "Action",
        "moveup": "Move to the previous line",
        "deleteRow": "Delete Row",
        "insertRow": "Insert Row",
        "importFromForm": "Import field configuration from the interface"
    }
};
