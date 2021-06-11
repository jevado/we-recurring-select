var $, RecurringSelectDialog;

$ = require("jquery");

RecurringSelectDialog = class RecurringSelectDialog {
  constructor(recurring_selector) {
    this.positionDialogVert = this.positionDialogVert.bind(this);
    this.cancel = this.cancel.bind(this);
    this.outerCancel = this.outerCancel.bind(this);
    this.save = this.save.bind(this);
    // ========================= render methods ===============================
    this.summaryUpdate = this.summaryUpdate.bind(this);
    this.summaryFetchSuccess = this.summaryFetchSuccess.bind(this);
    this.init_calendar_days = this.init_calendar_days.bind(this);
    this.init_calendar_weeks = this.init_calendar_weeks.bind(this);
    this.toggle_month_view = this.toggle_month_view.bind(this);
    // ========================= Change callbacks ===============================
    this.freqChanged = this.freqChanged.bind(this);
    this.intervalChanged = this.intervalChanged.bind(this);
    this.daysChanged = this.daysChanged.bind(this);
    this.dateOfMonthChanged = this.dateOfMonthChanged.bind(this);
    this.weekOfMonthChanged = this.weekOfMonthChanged.bind(this);
    this.recurring_selector = recurring_selector;
    this.current_rule = this.recurring_selector.recurring_select('current_rule');
    this.initDialogBox();
    if ((this.current_rule.hash == null) || (this.current_rule.hash.rule_type == null)) {
      this.freqChanged();
    } else {
      setTimeout(this.positionDialogVert, 10); // allow initial render
    }
  }

  initDialogBox() {
    var open_in;
    $(".rs_dialog_holder").remove();
    open_in = $("body");
    if ($(".ui-page-active").length) {
      open_in = $(".ui-page-active");
    }
    open_in.append(this.template());
    this.outer_holder = $(".rs_dialog_holder");
    this.inner_holder = this.outer_holder.find(".rs_dialog");
    this.content = this.outer_holder.find(".rs_dialog_content");
    this.positionDialogVert(true);
    this.mainEventInit();
    this.freqInit();
    this.summaryInit();
    this.outer_holder.trigger("recurring_select:dialog_opened");
    return this.freq_select.focus();
  }

  positionDialogVert(initial_positioning) {
    var dialog_height, margin_top, new_style_hash, window_height, window_width;
    window_height = $(window).height();
    window_width = $(window).width();
    dialog_height = this.content.outerHeight();
    if (dialog_height < 80) {
      dialog_height = 80;
    }
    margin_top = (window_height - dialog_height) / 2 - 30;
    if (margin_top < 10) {
      margin_top = 10;
    }
    new_style_hash = {
      "margin-top": margin_top + "px",
      "min-height": dialog_height + "px"
    };
    if (initial_positioning != null) {
      this.inner_holder.css(new_style_hash);
      return this.inner_holder.trigger("recurring_select:dialog_positioned");
    } else {
      this.inner_holder.addClass("animated");
      return this.inner_holder.animate(new_style_hash, 200, () => {
        this.inner_holder.removeClass("animated");
        this.content.css({
          "width": "auto"
        });
        return this.inner_holder.trigger("recurring_select:dialog_positioned");
      });
    }
  }

  cancel() {
    this.outer_holder.remove();
    return this.recurring_selector.recurring_select('cancel');
  }

  outerCancel(event) {
    if ($(event.target).hasClass("rs_dialog_holder")) {
      return this.cancel();
    }
  }

  save() {
    if (this.current_rule.str == null) {
      return;
    }
    this.outer_holder.remove();
    return this.recurring_selector.recurring_select('save', this.current_rule);
  }

  // ========================= Init Methods ===============================
  mainEventInit() {
    // Tap hooks are for jQueryMobile
    this.outer_holder.on('click tap', this.outerCancel);
    this.content.on('click tap', 'h1 a', this.cancel);
    this.save_button = this.content.find('input.rs_save').on("click tap", this.save);
    return this.content.find('input.rs_cancel').on("click tap", this.cancel);
  }

  freqInit() {
    var rule_type;
    this.freq_select = this.outer_holder.find(".rs_frequency");
    if ((this.current_rule.hash != null) && ((rule_type = this.current_rule.hash.rule_type) != null)) {
      if (rule_type.search(/Weekly/) !== -1) {
        this.freq_select.prop('selectedIndex', 1);
        this.initWeeklyOptions();
      } else if (rule_type.search(/Monthly/) !== -1) {
        this.freq_select.prop('selectedIndex', 2);
        this.initMonthlyOptions();
      } else if (rule_type.search(/Yearly/) !== -1) {
        this.freq_select.prop('selectedIndex', 3);
        this.initYearlyOptions();
      } else {
        this.initDailyOptions();
      }
    }
    return this.freq_select.on("change", this.freqChanged);
  }

  initDailyOptions() {
    var interval_input, section;
    section = this.content.find('.daily_options');
    interval_input = section.find('.rs_daily_interval');
    interval_input.val(this.current_rule.hash.interval);
    interval_input.on("change keyup", this.intervalChanged);
    return section.show();
  }

  initWeeklyOptions() {
    var interval_input, section;
    section = this.content.find('.weekly_options');
    // connect the interval field
    interval_input = section.find('.rs_weekly_interval');
    interval_input.val(this.current_rule.hash.interval);
    interval_input.on("change keyup", this.intervalChanged);
    // clear selected days
    section.find(".day_holder a").each(function(index, element) {
      return $(element).removeClass("selected");
    });
    // connect the day fields
    if ((this.current_rule.hash.validations != null) && (this.current_rule.hash.validations.day != null)) {
      $(this.current_rule.hash.validations.day).each(function(index, val) {
        return section.find(".day_holder a[data-value='" + val + "']").addClass("selected");
      });
    }
    section.off('click', '.day_holder a').on("click", ".day_holder a", this.daysChanged);
    return section.show();
  }

  initMonthlyOptions() {
    var base, base1, base2, in_week_mode, interval_input, section;
    section = this.content.find('.monthly_options');
    interval_input = section.find('.rs_monthly_interval');
    interval_input.val(this.current_rule.hash.interval);
    interval_input.on("change keyup", this.intervalChanged);
    (base = this.current_rule.hash).validations || (base.validations = {});
    (base1 = this.current_rule.hash.validations).day_of_month || (base1.day_of_month = []);
    (base2 = this.current_rule.hash.validations).day_of_week || (base2.day_of_week = {});
    this.init_calendar_days(section);
    this.init_calendar_weeks(section);
    in_week_mode = Object.keys(this.current_rule.hash.validations.day_of_week).length > 0;
    section.find(".monthly_rule_type_week").prop("checked", in_week_mode);
    section.find(".monthly_rule_type_day").prop("checked", !in_week_mode);
    this.toggle_month_view();
    section.find("input[name=monthly_rule_type]").on("change", this.toggle_month_view);
    return section.show();
  }

  initYearlyOptions() {
    var interval_input, section;
    section = this.content.find('.yearly_options');
    interval_input = section.find('.rs_yearly_interval');
    interval_input.val(this.current_rule.hash.interval);
    interval_input.on("change keyup", this.intervalChanged);
    return section.show();
  }

  summaryInit() {
    this.summary = this.outer_holder.find(".rs_summary");
    return this.summaryUpdate();
  }

  summaryUpdate(new_string) {
    var rule_str;
    this.summary.width(this.content.width());
    if ((this.current_rule.hash != null) && (this.current_rule.str != null)) {
      this.summary.removeClass("fetching");
      this.save_button.removeClass("disabled");
      rule_str = this.current_rule.str.replace("*", "");
      if (rule_str.length < 20) {
        rule_str = `${$.fn.recurring_select.texts[$.fn.recurring_select.options["iso_code"]]["summary"]}: ` + rule_str;
      }
      return this.summary.find("span").html(rule_str);
    } else {
      this.summary.addClass("fetching");
      this.save_button.addClass("disabled");
      this.summary.find("span").html("");
      return this.summaryFetch();
    }
  }

  summaryFetch() {
    var rule_type;
    if (!((this.current_rule.hash != null) && ((rule_type = this.current_rule.hash.rule_type) != null))) {
      return;
    }
    this.current_rule.hash['week_start'] = $.fn.recurring_select.texts[$.fn.recurring_select.options["iso_code"]]["first_day_of_week"];
    return $.ajax({
      url: "/recurring_select/translate/" + $.fn.recurring_select.options["iso_code"],
      type: "POST",
      data: this.current_rule.hash,
      success: this.summaryFetchSuccess
    });
  }

  summaryFetchSuccess(data) {
    this.current_rule.str = data;
    this.summaryUpdate();
    return this.content.css({
      "width": "auto"
    });
  }

  init_calendar_days(section) {
    var day_link, end_of_month_link, i, monthly_calendar, num;
    monthly_calendar = section.find(".rs_calendar_day");
    monthly_calendar.html("");
    for (num = i = 1; i <= 31; num = ++i) {
      monthly_calendar.append((day_link = $(document.createElement("a")).text(num)));
      if ($.inArray(num, this.current_rule.hash.validations.day_of_month) !== -1) {
        day_link.addClass("selected");
      }
    }
    // add last day of month button
    monthly_calendar.append((end_of_month_link = $(document.createElement("a")).text($.fn.recurring_select.texts[$.fn.recurring_select.options["iso_code"]]["last_day"])));
    end_of_month_link.addClass("end_of_month");
    if ($.inArray(-1, this.current_rule.hash.validations.day_of_month) !== -1) {
      end_of_month_link.addClass("selected");
    }
    return monthly_calendar.find("a").on("click tap", this.dateOfMonthChanged);
  }

  init_calendar_weeks(section) {
    var cell_str, day_link, day_of_week, i, index, j, len, monthly_calendar, num, ref, ref1, ref2, row_labels, show_row;
    monthly_calendar = section.find(".rs_calendar_week");
    monthly_calendar.html("");
    row_labels = $.fn.recurring_select.texts[$.fn.recurring_select.options["iso_code"]]["order"];
    show_row = $.fn.recurring_select.options["monthly"]["show_week"];
    cell_str = $.fn.recurring_select.texts[$.fn.recurring_select.options["iso_code"]]["days_first_letter"];
    ref = [1, 2, 3, 4, 5, 6];
    for (index = i = 0, len = ref.length; i < len; index = ++i) {
      num = ref[index];
      if (show_row[index]) {
        monthly_calendar.append(`<span>${row_labels[num - 1]}</span>`);
        for (day_of_week = j = ref1 = $.fn.recurring_select.texts[$.fn.recurring_select.options["iso_code"]]["first_day_of_week"], ref2 = 7 + $.fn.recurring_select.texts[$.fn.recurring_select.options["iso_code"]]["first_day_of_week"]; (ref1 <= ref2 ? j < ref2 : j > ref2); day_of_week = ref1 <= ref2 ? ++j : --j) {
          day_of_week = day_of_week % 7;
          day_link = $("<a>", {
            text: cell_str[day_of_week]
          });
          day_link.attr("day", day_of_week);
          day_link.attr("instance", num);
          monthly_calendar.append(day_link);
        }
      }
    }
    $.each(this.current_rule.hash.validations.day_of_week, function(key, value) {
      return $.each(value, function(index, instance) {
        return section.find(`a[day='${key}'][instance='${instance}']`).addClass("selected");
      });
    });
    return monthly_calendar.find("a").on("click tap", this.weekOfMonthChanged);
  }

  toggle_month_view() {
    var week_mode;
    week_mode = this.content.find(".monthly_rule_type_week").prop("checked");
    this.content.find(".rs_calendar_week").toggle(week_mode);
    return this.content.find(".rs_calendar_day").toggle(!week_mode);
  }

  freqChanged() {
    var base;
    if (!$.isPlainObject(this.current_rule.hash)) { // for custom values
      this.current_rule.hash = null;
    }
    (base = this.current_rule).hash || (base.hash = {});
    this.current_rule.hash.interval = 1;
    this.current_rule.hash.until = null;
    this.current_rule.hash.count = null;
    this.current_rule.hash.validations = null;
    this.content.find(".freq_option_section").hide();
    this.content.find("input[type=radio], input[type=checkbox]").prop("checked", false);
    switch (this.freq_select.val()) {
      case "Weekly":
        this.current_rule.hash.rule_type = "IceCube::WeeklyRule";
        this.current_rule.str = $.fn.recurring_select.texts[$.fn.recurring_select.options["iso_code"]]["weekly"];
        this.initWeeklyOptions();
        break;
      case "Monthly":
        this.current_rule.hash.rule_type = "IceCube::MonthlyRule";
        this.current_rule.str = $.fn.recurring_select.texts[$.fn.recurring_select.options["iso_code"]]["monthly"];
        this.initMonthlyOptions();
        break;
      case "Yearly":
        this.current_rule.hash.rule_type = "IceCube::YearlyRule";
        this.current_rule.str = $.fn.recurring_select.texts[$.fn.recurring_select.options["iso_code"]]["yearly"];
        this.initYearlyOptions();
        break;
      default:
        this.current_rule.hash.rule_type = "IceCube::DailyRule";
        this.current_rule.str = $.fn.recurring_select.texts[$.fn.recurring_select.options["iso_code"]]["daily"];
        this.initDailyOptions();
    }
    this.summaryUpdate();
    return this.positionDialogVert();
  }

  intervalChanged(event) {
    var base;
    this.current_rule.str = null;
    (base = this.current_rule).hash || (base.hash = {});
    this.current_rule.hash.interval = parseInt($(event.currentTarget).val());
    if (this.current_rule.hash.interval < 1 || isNaN(this.current_rule.hash.interval)) {
      this.current_rule.hash.interval = 1;
    }
    return this.summaryUpdate();
  }

  daysChanged(event) {
    var base, raw_days;
    $(event.currentTarget).toggleClass("selected");
    this.current_rule.str = null;
    (base = this.current_rule).hash || (base.hash = {});
    this.current_rule.hash.validations = {};
    raw_days = this.content.find(".day_holder a.selected").map(function() {
      return parseInt($(this).data("value"));
    });
    this.current_rule.hash.validations.day = raw_days.get();
    this.summaryUpdate();
    return false; // this prevents default and propogation
  }

  dateOfMonthChanged(event) {
    var base, raw_days;
    $(event.currentTarget).toggleClass("selected");
    this.current_rule.str = null;
    (base = this.current_rule).hash || (base.hash = {});
    this.current_rule.hash.validations = {};
    raw_days = this.content.find(".monthly_options .rs_calendar_day a.selected").map(function() {
      var res;
      res = $(this).text() === $.fn.recurring_select.texts[$.fn.recurring_select.options["iso_code"]]["last_day"] ? -1 : parseInt($(this).text());
      return res;
    });
    this.current_rule.hash.validations.day_of_week = {};
    this.current_rule.hash.validations.day_of_month = raw_days.get();
    this.summaryUpdate();
    return false;
  }

  weekOfMonthChanged(event) {
    var base;
    $(event.currentTarget).toggleClass("selected");
    this.current_rule.str = null;
    (base = this.current_rule).hash || (base.hash = {});
    this.current_rule.hash.validations = {};
    this.current_rule.hash.validations.day_of_month = [];
    this.current_rule.hash.validations.day_of_week = {};
    this.content.find(".monthly_options .rs_calendar_week a.selected").each((index, elm) => {
      var base1, day, instance;
      day = parseInt($(elm).attr("day"));
      instance = parseInt($(elm).attr("instance"));
      (base1 = this.current_rule.hash.validations.day_of_week)[day] || (base1[day] = []);
      return this.current_rule.hash.validations.day_of_week[day].push(instance);
    });
    this.summaryUpdate();
    return false;
  }

  // ========================= Change callbacks ===============================
  template() {
    var day_of_week, i, ref, ref1, str;
    str = `<div class='rs_dialog_holder'> <div class='rs_dialog'> <div class='rs_dialog_content'> <h1>${$.fn.recurring_select.texts[$.fn.recurring_select.options["iso_code"]]["repeat"]} <a href='#' title='${$.fn.recurring_select.texts[$.fn.recurring_select.options["iso_code"]]["cancel"]}' Alt='${$.fn.recurring_select.texts[$.fn.recurring_select.options["iso_code"]]["cancel"]}'></a> </h1> <p class='frequency-select-wrapper'> <label for='rs_frequency'>${$.fn.recurring_select.texts[$.fn.recurring_select.options["iso_code"]]["frequency"]}:</label> <select data-wrapper-class='ui-recurring-select' id='rs_frequency' class='rs_frequency' name='rs_frequency'> <option value='Daily'>${$.fn.recurring_select.texts[$.fn.recurring_select.options["iso_code"]]["daily"]}</option> <option value='Weekly'>${$.fn.recurring_select.texts[$.fn.recurring_select.options["iso_code"]]["weekly"]}</option> <option value='Monthly'>${$.fn.recurring_select.texts[$.fn.recurring_select.options["iso_code"]]["monthly"]}</option>`;
    if ($.fn.recurring_select.options['yearly']) {
      str += `<option value='Yearly'>${$.fn.recurring_select.texts[$.fn.recurring_select.options["iso_code"]]["yearly"]}</option>`;
    }
    str += `</select> </p> <div class='daily_options freq_option_section'> <p> ${$.fn.recurring_select.texts[$.fn.recurring_select.options["iso_code"]]["every"]} <input type='text' data-wrapper-class='ui-recurring-select' name='rs_daily_interval' class='rs_daily_interval rs_interval' value='1' size='2' /> ${$.fn.recurring_select.texts[$.fn.recurring_select.options["iso_code"]]["days"]} </p> </div> <div class='weekly_options freq_option_section'> <p> ${$.fn.recurring_select.texts[$.fn.recurring_select.options["iso_code"]]["every"]} <input type='text' data-wrapper-class='ui-recurring-select' name='rs_weekly_interval' class='rs_weekly_interval rs_interval' value='1' size='2' /> ${$.fn.recurring_select.texts[$.fn.recurring_select.options["iso_code"]]["weeks_on"]}: </p> <div class='day_holder'>`;
    for (day_of_week = i = ref = $.fn.recurring_select.texts[$.fn.recurring_select.options["iso_code"]]["first_day_of_week"], ref1 = 7 + $.fn.recurring_select.texts[$.fn.recurring_select.options["iso_code"]]["first_day_of_week"]; (ref <= ref1 ? i < ref1 : i > ref1); day_of_week = ref <= ref1 ? ++i : --i) {
      day_of_week = day_of_week % 7;
      str += `<a href='#' data-value='${day_of_week}'>${$.fn.recurring_select.texts[$.fn.recurring_select.options["iso_code"]]["days_first_letter"][day_of_week]}</a>`;
    }
    str += `</div> <span style='clear:both; visibility:hidden; height:1px;'>.</span> </div> <div class='monthly_options freq_option_section'> <p> ${$.fn.recurring_select.texts[$.fn.recurring_select.options["iso_code"]]["every"]} <input type='text' data-wrapper-class='ui-recurring-select' name='rs_monthly_interval' class='rs_monthly_interval rs_interval' value='1' size='2' /> ${$.fn.recurring_select.texts[$.fn.recurring_select.options["iso_code"]]["months"]}: </p> <p class='monthly_rule_type'> <span><label for='monthly_rule_type_day'>${$.fn.recurring_select.texts[$.fn.recurring_select.options["iso_code"]]["day_of_month"]}</label><input type='radio' class='monthly_rule_type_day' name='monthly_rule_type' id='monthly_rule_type_day' value='true' /></span> <span><label for='monthly_rule_type_week'>${$.fn.recurring_select.texts[$.fn.recurring_select.options["iso_code"]]["day_of_week"]}</label><input type='radio' class='monthly_rule_type_week' name='monthly_rule_type' id='monthly_rule_type_week' value='true' /></span> </p> <p class='rs_calendar_day'></p> <p class='rs_calendar_week'></p> </div>`;
    if ($.fn.recurring_select.options['yearly']) {
      str += `<div class='yearly_options freq_option_section'> <p> ${$.fn.recurring_select.texts[$.fn.recurring_select.options["iso_code"]]["every"]} <input type='text' data-wrapper-class='ui-recurring-select' name='rs_yearly_interval' class='rs_yearly_interval rs_interval' value='1' size='2' /> ${$.fn.recurring_select.texts[$.fn.recurring_select.options["iso_code"]]["years"]} </p> </div> `;
    }
    return str += `<p class='rs_summary'> <span></span> </p> <div class='controls'> <input type='button' data-wrapper-class='ui-recurring-select' class='rs_save' value='${$.fn.recurring_select.texts[$.fn.recurring_select.options["iso_code"]]["ok"]}' /> <input type='button' data-wrapper-class='ui-recurring-select' class='rs_cancel' value='${$.fn.recurring_select.texts[$.fn.recurring_select.options["iso_code"]]["cancel"]}' /> </div> </div> </div> </div>`;
  }

};

export default RecurringSelectDialog;
