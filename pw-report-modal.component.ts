import {Component, Inject, QueryList, ViewChildren} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {BsModalRef} from 'ngx-bootstrap';
import {
  ConfigServiceInterface, Project, PwChartComponent, PwUtil, TrajectoryService,
  WellString
} from 'pocoweb-components';
import {ResultsService} from '../results/shared/results.service';
import {
  EnvelopeChartValues, SafetyCasingPoints,
  SafetyChartValues
} from '../load/shared/load-scenario.model';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';
//import * as moment from 'moment';
import Docxtemplater from 'docxtemplater';
import * as imageModule from 'docxtemplater-image-module';
import * as expressions from 'angular-expressions';
import {Settings} from 'pocoweb-components/src/app/pw-auth/shared/settings.model';


declare let JSZipUtils, JSZip, saveAs: any;

@Component({
  selector: 'scr-report-modal',
  templateUrl: 'pw-report-modal.component.html'
})
export class PwReportModalComponent {

  project: Project;
  modal: BsModalRef;
  results: any;
  wellStrings: WellString[];
  needToGenerate: boolean;
  loadingResults: boolean;
  wellEnvelopeMapValues = {};
  safetyChartMapValues = {};
  dataMap: any;
  generatingResults: boolean;
  noResults: boolean;
  firstTime: boolean;
  wellCharts: any;
  generalCharts: any;
  chartsDone: boolean;
  angularParser: any;
  assetsPath: string = '';
  safetyCasingPoints: SafetyCasingPoints;

  @ViewChildren(PwChartComponent)
  chartsComponents: QueryList<PwChartComponent>;

  constructor(private route: ActivatedRoute,
              private resultService: ResultsService,
              @Inject('ConfigServiceInterface') private configService: ConfigServiceInterface) {
    this.configService.getSettings().subscribe((settings: Settings) => {
      this.assetsPath = settings.assetsPath === undefined ? '' : settings.assetsPath + '/';
    });
    const pwUtil = new PwUtil();
    this.firstTime = true;
    this.project = route.firstChild.snapshot.data['project'];
    this.dataMap = {'geopressures': {}, 'temperatures': {}};
    this.wellEnvelopeMapValues = {};
    this.safetyChartMapValues = {};
    this.generalCharts = {};
    this.project.input.geopressures.forEach(geopressure =>
      this.dataMap['geopressures'][geopressure.name] = pwUtil.convertGeopressureTable(geopressure));
    this.project.input.temperature.groundThermalProfiles.forEach(temperature => {
      if (temperature.active) {
        this.dataMap['temperatures'][temperature.name] = pwUtil.convertTemperatureData(temperature);
      }
    });
    this.noResults = false;
    this.needToGenerate = false;
    this.generatingResults = false;
    this.loadingResults = true;
    this.wellCharts = {};
    this.chartsDone = false;
    this.angularParser = function(tag) {
      return {
        get: tag === '.' ? function(s){ return s;} : function(s) {
          return expressions.compile(tag.replace(/(’|“|”)/g, "'"))(s);
        }
      };
    };

    resultService.getOutput(this.project.id).subscribe(results => {
      this.results = results;
      if (Object.getOwnPropertyNames(results).length < 2) {
        this.needToGenerate = true;
      } else {
        this.safetyCasingPoints = results['N2752(2014)']['casing'];
        this.wellStrings = this.results.wellStrings.filter(wellString => wellString.interval !== 'CONDUCTOR'
          && wellString.interval !== 'OPEN'
          && wellString.loadScenarios.length > 0);
        this.wellStrings.forEach(wellString => {
          this.wellEnvelopeMapValues[wellString.sequence] = {};
          this.safetyChartMapValues[wellString.sequence] = new SafetyChartValues();
          wellString.stringSections.forEach(section => {
            this.wellEnvelopeMapValues[wellString.sequence][section.sequence] = new EnvelopeChartValues();
          });
        });
        this.generateData();
      }
      this.loadingResults = false;
    });
  }

  close() {
    this.modal.hide();
  }

  parentListen($event) {
    setTimeout(() => {
      if (this.firstTime && $event.type === 'CHART_CREATED') {
        this.firstTime = false;
        const observersArray = [];
        this.chartsComponents.toArray().forEach(chart => {

          if (chart.rectId !== 'geopressures' && chart.rectId !== 'temperatures') {
            const chartIdParts: string[] = chart.rectId.split('-');
            const wellId = chartIdParts[0];
            const sectionId = chartIdParts[1];
            this.wellCharts[wellId] =
              this.wellCharts[wellId] === undefined ? {} : this.wellCharts[wellId];
            this.wellCharts[wellId][sectionId] =
              this.wellCharts[wellId][sectionId] === undefined ?
                {} : this.wellCharts[wellId][sectionId];
            observersArray.push(chart.getBase64());
          } else {
            observersArray.push(chart.getBase64());
          }
        });
        Observable.combineLatest(observersArray).subscribe((args) => {
          this.chartsComponents.toArray().forEach((chart, index) => {
            if (chart.rectId !== 'geopressures' && chart.rectId !== 'temperatures') {
              const chartIdParts: string[] = chart.rectId.split('-');
              const wellId = chartIdParts[0];
              const sectionId = chartIdParts[1];
              const type = chartIdParts[2];

              if (sectionId === 'axialSafetyFactor'
                || sectionId === 'burstSafetyFactor'
                || sectionId === 'collapseSafetyFactor'
                || sectionId === 'vonMisesSafetyFactor') {

                this.wellCharts[wellId][sectionId] = args[index];

              } else {
                this.wellCharts[wellId] =
                  this.wellCharts[wellId] === undefined ? {} : this.wellCharts[wellId];

                this.wellCharts[wellId][sectionId] =
                  this.wellCharts[wellId][sectionId] === undefined ?
                    {} : this.wellCharts[wellId][sectionId];
                this.wellCharts[wellId][sectionId][type] = args[index];
              }
            } else {
              this.generalCharts[chart.rectId] = args[index];
            }
          });
          this.generalCharts.wellStrings = this.wellCharts;
          this.generatingResults = false;
          this.chartsDone = true;
        });

      }
    });

  }

  generateResults() {
    this.chartsDone = false;
    this.generatingResults = true;
    this.noResults = false;
    this.needToGenerate = false;
    this.loadingResults = false;
    this.resultService.generateResults(this.project.id).subscribe(results => {
      this.results = results;
      if (Object.getOwnPropertyNames(results).length < 2) {
        this.noResults = true;
      } else {
        this.safetyCasingPoints = results['N2752(2014)']['casing'];
        this.wellStrings = this.results.wellStrings.filter(wellString => wellString.interval !== 'CONDUCTOR'
          && wellString.interval !== 'OPEN'
          && wellString.loadScenarios.length > 0);
        this.wellStrings.forEach(wellString => {
          this.wellEnvelopeMapValues[wellString.sequence] = {};
          this.safetyChartMapValues[wellString.sequence] = new SafetyChartValues();
          wellString.stringSections.forEach(section => {
            this.wellEnvelopeMapValues[wellString.sequence][section.sequence] = new EnvelopeChartValues();
          });
        });
        this.generateData();
      }
      this.generatingResults = false;
    });
  }

  generateData() {
    this.wellStrings.forEach((wellString: WellString) => {
      wellString.loadScenarios.forEach(data => {

        if (data.results['axialSafetyFactor'] && data.results['axialSafetyFactor'].length > 0) {
          this.safetyChartMapValues[wellString.sequence]['axialSafetyFactor'][data.name] =
            data.results['axialSafetyFactor'];
        }

        if (data.results['burstSafetyFactor'] && data.results['burstSafetyFactor'].length > 0) {
          this.safetyChartMapValues[wellString.sequence]['burstSafetyFactor'][data.name] =
            data.results['burstSafetyFactor'];
        }

        if (data.results['collapseSafetyFactor'] && data.results['collapseSafetyFactor'].length > 0) {
          this.safetyChartMapValues[wellString.sequence]['collapseSafetyFactor'][data.name] =
            data.results['collapseSafetyFactor'];
        }

        if (data.results['vonMisesSafetyFactor'] && data.results['vonMisesSafetyFactor'].length > 0) {
          this.safetyChartMapValues[wellString.sequence]['vonMisesSafetyFactor'][data.name] =
            data.results['vonMisesSafetyFactor'];
        }

        if (data.results) {
          wellString.stringSections.forEach(activeSection => {
            if (data.results['vmData'] && data.results['vmData'].length > 0) {
              this.wellEnvelopeMapValues[wellString.sequence][activeSection.sequence]['vM'][data.name] =
                data.results['vmData'][activeSection.sequence - 1];
            }
            if (data.results['analyticData'] && data.results['analyticData'].length > 0) {
              this.wellEnvelopeMapValues[wellString.sequence][activeSection.sequence]['analytic'][data.name] =
                data.results['analyticData'][activeSection.sequence - 1];
            }

            if (data.results['ksData'] && data.results['ksData'].length > 0) {
              this.wellEnvelopeMapValues[wellString.sequence][activeSection.sequence]['ks'][data.name] =
                data.results['ksData'][activeSection.sequence - 1];
            }

            if (data.results['ktData'] && data.results['ktData'].length > 0) {
              this.wellEnvelopeMapValues[wellString.sequence][activeSection.sequence]['kt'][data.name] =
                data.results['ktData'][activeSection.sequence - 1];
            }

            if (activeSection['results']) {
              this.wellEnvelopeMapValues[wellString.sequence][activeSection.sequence]['vM']['vmEllipse'] =
                activeSection['results']['vmEllipse'];
              this.wellEnvelopeMapValues[wellString.sequence][activeSection.sequence]['vM']['vmConnectionEllipse'] =
                activeSection['results']['vmConnectionEllipse'];
              this.wellEnvelopeMapValues[wellString.sequence][activeSection.sequence]['vM']['vmApi'] =
                activeSection['results']['vmApi'];
              this.wellEnvelopeMapValues[wellString.sequence][activeSection.sequence]['analytic']['analyticEllipse'] =
                activeSection['results']['analyticEllipse'];
              this.wellEnvelopeMapValues[wellString.sequence][activeSection.sequence]['analytic']['analyticConnectionEllipse'] =
                activeSection['results']['analyticConnectionEllipse'];
              this.wellEnvelopeMapValues[wellString.sequence][activeSection.sequence]['ks']['ksEllipse'] =
                activeSection['results']['ksEllipse'];
              this.wellEnvelopeMapValues[wellString.sequence][activeSection.sequence]['kt']['ktEllipse'] =
                activeSection['results']['ktEllipse'];
            }
          });
        }
      });
    });

  }

  downloadReport() {
    JSZipUtils.getBinaryContent(this.assetsPath + 'assets/templates/report_template.docx', this.callbackTemplateLoaded.bind(this));
  }

  callbackTemplateLoaded(error, content) {
    const jsonToExport = Object.assign({}, this.project);
    //const date = moment().format('DD/MM/YYYY');
    const newDate = new Date();
    const date = newDate.toLocaleDateString();
    jsonToExport['date'] = date;
    jsonToExport['input']['geopressuresChart'] = this.generalCharts['geopressures'];
    jsonToExport['input']['groundThermalChart'] = this.generalCharts['temperatures'];
    this.project.input.wellStrings.forEach(wellString => {

      if (wellString.interval !== 'CONDUCTOR'
        && wellString.interval !== 'OPEN' &&
        (wellString.loadScenarios && wellString.loadScenarios.length > 0)
      ) {

        jsonToExport['input']['wellStrings'][wellString.sequence - 1]['safetyFactorResultTable'] =
          this.results.wellStrings[wellString.sequence - 1].safetyFactorResultTable;

        jsonToExport['input']['wellStrings'][wellString.sequence - 1]['axialSafetyFactorChart'] =
          this.generalCharts['wellStrings'][wellString.sequence]['axialSafetyFactor'];

        jsonToExport['input']['wellStrings'][wellString.sequence - 1]['burstSafetyFactorChart'] =
          this.generalCharts['wellStrings'][wellString.sequence]['burstSafetyFactor'];

        jsonToExport['input']['wellStrings'][wellString.sequence - 1]['collapseSafetyFactorChart'] =
          this.generalCharts['wellStrings'][wellString.sequence]['collapseSafetyFactor'];

        jsonToExport['input']['wellStrings'][wellString.sequence - 1]['vonMisesSafetyFactorChart'] =
          this.generalCharts['wellStrings'][wellString.sequence]['vonMisesSafetyFactor'];


        wellString.stringSections.forEach(section => {

          jsonToExport['input']['wellStrings'][wellString.sequence - 1]
            ['stringSections'][section.sequence - 1]['results'] = {};

          jsonToExport['input']['wellStrings'][wellString.sequence - 1]
            ['stringSections'][section.sequence - 1]['results']['vonMisesChart'] =
            this.generalCharts['wellStrings'][wellString.sequence][section.sequence]['vM'];

          jsonToExport['input']['wellStrings'][wellString.sequence - 1]
            ['stringSections'][section.sequence - 1]['interval'] = wellString.interval;

          jsonToExport['input']['wellStrings'][wellString.sequence - 1]
            ['stringSections'][section.sequence - 1]['type'] = wellString.type;

        });
      }
    });

    const hasSaltFormation = this.project.input.lithologies.filter(lithology => lithology.salt).length > 0;
    jsonToExport['input']['hasSaltFormation'] = hasSaltFormation;
    if (error) {
      throw error;
    }

    const zip = new JSZip(content);
    const doc = new Docxtemplater().loadZip(zip).setOptions({parser:this.angularParser});

    doc.setData(jsonToExport);

    try {
      const opts: any = {};
      opts.centered = false;
      opts.getImage = function (tagValue, tagName) {
        return uriToBinary(tagValue);
      };
      opts.getSize = function (img, tagValue, tagName) {
        return [622, 350];
      };
      doc.attachModule(new imageModule(opts));
      doc.render();
    }
    catch (error) {
      throw error;
    }
    const out = doc.getZip().generate({
      type: 'blob',
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });
    saveAs(out, 'Projeto PROJ-EP_' + this.project.well.name + '_v0_' + date + '.docx');
  }

}

function uriToBinary(uri) {
  const byteString = window.atob(uri.split(',')[1]);
  const mimeString = uri.split(',')[0].split(':')[1].split(';')[0];
  const buffer = new ArrayBuffer(byteString.length);
  const intArray = new Uint8Array(buffer);
  for (let i = 0; i < byteString.length; i++) {
    intArray[i] = byteString.charCodeAt(i);
  }

  return intArray.buffer;
}
